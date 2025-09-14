/* eslint-disable */
import { fastify, FastifyInstance, FastifyReply, FastifyRequest, FastifyPluginAsync, FastifyError } from 'fastify';
import { IModule } from '@common/modules/IModule';
import { HTTPMETODO } from '@common/modules/Ruta';
import { randomBytes } from 'crypto';
import { ENV } from '@modules/shared';
import { DefaultErrorModel } from './DefaultError';
import { IServer } from '../IServer';
import fastifyCors from '@fastify/cors';
import { decodeBase64, isValidBase64 } from '@common/utils/base64';
import { getNestedValue } from '@common/utils';
import rateLimit from '@fastify/rate-limit';
import CustomError from '@common/utils/CustomError';

export class FastifyServer implements IServer {
    port: number = +ENV.PORT;
    app: FastifyInstance;

    constructor() {
        this.app = fastify({
            logger: false,
            return503OnClosing: false,
            genReqId: (_) => randomBytes(20).toString('hex'),
        });
        this.printRoutes();
        this.errorHandler();
        this.printIncomming();
        this.addRateLimit();
    }

    private addRateLimit = () => {
        this.app.register(rateLimit, {
            max: Number(ENV.RATE_LIMIT_MAX),
            timeWindow: Number(ENV.RATE_LIMIT_TIME_WINDOW),
            hook: 'preHandler',
            errorResponseBuilder: function (_request: any) {
                return {
                    code: 500,
                    error: 'RATE LIMIT ERROR',
                    message: 'Demasiadas peticiones, inténtelo más tarde',
                    date: Date.now(),
                };
            },
        });
    };

    private printIncomming = async () => {
        this.app.addHook('onSend', async (_request, _reply, payloadResponse) => {
            const incommingData = this.buildDataLog(_request);
            console.log(
                JSON.stringify({
                    statusCode: _reply.statusCode,
                    RESPONSE: _request.url,
                    incommingData,
                    payloadResponse,
                }),
            );
        });
    };

    private printRoutes = async (): Promise<void> => {
        this.app.addHook('onRoute', (r) => {
            if (r.method !== 'HEAD' && !r.url.includes('api/docs/static')) {
                console.log(r.method, r.url);
            }
        });
        this.app.register(fastifyCors, {
            allowedHeaders: ['Origin', 'Authorization', 'Accept', 'X-Requested-With', 'Content-Type'],
            methods: ['GET', 'PUT', 'POST'],
            origin: (origin: string | undefined, cb: Function) => {
                if (ENV.ALLOWED_ORIGIN === '*') {
                    return cb(null, true);
                }
                const isAllowedOrigin = ENV.ALLOWED_ORIGIN.split(',').includes(origin ?? '');
                if (isAllowedOrigin) {
                    return cb(null, true);
                }
                return cb(new Error('Not allowed by CORS'), false);
            },
        });
    };

    private errorHandler = () => {
        this.app.setErrorHandler((error: any, _request, reply) => {
            console.log('ERROR HANDLER', JSON.stringify(error));
            if ('toResponse' in error && typeof error.toResponse === 'function') {
                const formattedError = error.toResponse();
                const statusCode = formattedError.statusCode ?? 500;
                reply.status(statusCode).send(formattedError);
                return;
            }

            if (error?.validation?.length) {
                error.statusCode = 400;
            }

            const Error = error instanceof CustomError ? this.buildResponseError(error) : this.buildDefaultError(error);

            console.log('ERROR FASTIFY', JSON.stringify(Error));

            const statusCode = Error.statusCode && +Error.statusCode > 0 ? Error.statusCode : 500;
            reply.status(statusCode).send(Error.details ?? Error);
        });
    };

    buildResponseError(error: CustomError): DefaultErrorModel {
        return {
            statusCode: error.statusCode,
            message: error?.message,
            stack: error?.stack,
            defaultMessage: 'Error handler log',
            isError: error.isCustomError,
            cause: '',
            code: error.statusCode,
            details: error,
        };
    }

    buildDefaultError(error: FastifyError): DefaultErrorModel {
        return {
            message: error?.message ?? 'Error sin mensaje',
            isError: true,
            cause: 'Error sin causa',
            stack: error?.stack ?? 'Error sin stack',
            code: +error?.code,
            statusCode: error?.statusCode ?? 500,
            defaultMessage: 'Error handler log',
            details: error,
        };
    }

    buildDataLog(request: FastifyRequest) {
        try {
            const body = getNestedValue(request, 'body.message.data', request.body);
            return typeof body === 'string' && isValidBase64(body) ? decodeBase64(body) : body;
        } catch (error) {
            console.log('ERROR DECODIFICANDO DATA DE BASE64');
            return request.body;
        }
    }

    addModule = async (module: IModule): Promise<void> => {
        const prefix = `/${ENV.DOMAIN}/${ENV.SERVICE_NAME}`;
        const pluggin: FastifyPluginAsync = async (router) => {
            const rutas = module.getRutas();
            for (const indexRuta in rutas) {
                const ruta = rutas[indexRuta];
                const url = ruta.url;
                const schema = ruta?.schema ?? {};
                switch (ruta.metodo) {
                    case HTTPMETODO.POST:
                        router.post(url, schema, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const { logger } = req as any;
                            const data = {
                                ...(req.body as Record<string, unknown>),
                                ...(req.params as Record<string, unknown>),
                            };
                            const headers = req.headers;
                            const request = {
                                headers,
                                data,
                                logger,
                            };

                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.PUT:
                        router.put(url, schema, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const request = {
                                data: {
                                    ...(req.body as Record<string, unknown>),
                                    ...(req.params as Record<string, unknown>),
                                },
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.PATCH:
                        router.patch(url, schema, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const request = {
                                data: {
                                    ...(req.body as Record<string, unknown>),
                                    ...(req.params as Record<string, unknown>),
                                },
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.DELETE:
                        router.delete(url, schema, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const request = {
                                data: {
                                    ...(req.body as Record<string, unknown>),
                                    ...(req.params as Record<string, unknown>),
                                },
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.GET:
                    default:
                        router.get(url, schema, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const request = {
                                data: {
                                    ...(req.body as Record<string, unknown>),
                                    ...(req.params as Record<string, unknown>),
                                    ...(req.query as Record<string, unknown>),
                                },
                                headers: {
                                    ...(req.headers as Record<string, unknown>),
                                },
                                raw: reply.raw,
                            };
                            if (url === '/status') {
                                await ruta.evento(request, reply);
                                return;
                            } else {
                                reply.header('Content-Type', 'application/json');
                            }
                            const result = await ruta.evento(request);
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                }
            }
        };
        this.app.register(pluggin, {
            prefix: prefix + module.ruta,
        });
    };

    start = async (): Promise<void> => {
        try {
            await this.app.listen({ port: this.port });
            console.log(`Application running on port ${this.port}`);
        } catch (err) {
            console.log(JSON.stringify(err));
            process.exit(1);
        }
    };
}
