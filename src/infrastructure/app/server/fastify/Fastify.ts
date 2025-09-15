/* eslint-disable */
import { fastify, FastifyInstance, FastifyReply, FastifyRequest, FastifyPluginAsync } from 'fastify';
import fastifyCors from '@fastify/cors';
import { randomBytes } from 'crypto';
import { IModule } from '@common/modules/IModule';
import { HTTPMETODO } from '@common/modules/Ruta';
import { ENV } from '@modules/shared';
import CustomError from '@common/utils/CustomError';

export class FastifyServer {
    port: number = +ENV.PORT;
    app: FastifyInstance;

    constructor() {
        this.app = fastify({
            logger: false,
            return503OnClosing: false,
            genReqId: () => randomBytes(20).toString('hex'),
        });

        this.setupCors();
        this.setupErrorHandler();
    }

    private setupCors() {
        this.app.register(fastifyCors, {
            origin: (origin: string | undefined, cb: Function) => {
                if (!origin) return cb(null, true); // Postman/cURL
                if (ENV.ALLOWED_ORIGIN === '*') return cb(null, true);
                const allowed = ENV.ALLOWED_ORIGIN.split(',').map((s) => s.trim());
                cb(allowed.includes(origin) ? null : new Error('Not allowed by CORS'), allowed.includes(origin));
            },
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: [
                'Origin',
                'Accept',
                'Content-Type',
                'Authorization',
                'X-Requested-With',
                'X-Request-Id',
                'X-Timestamp',
                'Accept-Language',
                'X-Client-Platform',
                'X-Api-Version',
            ],
            exposedHeaders: ['Content-Length', 'X-Request-Id'],
        });
    }

    private setupErrorHandler() {
        this.app.setErrorHandler((error: any, _req, reply) => {
            const stripCode = (arr: any[]) => arr.map(({ code, ...rest }) => rest);

            // CustomError con toResponse()
            if (typeof error?.toResponse === 'function') {
                const f = error.toResponse();
                const status = Number(f.statusCode) || 500;
                const detSrc = Array.isArray(f.details)
                    ? f.details
                    : Array.isArray((f as any).errors)
                    ? (f as any).errors
                    : undefined;
                const det = Array.isArray(detSrc) ? stripCode(detSrc) : undefined;
                reply.status(status).send({ statusCode: status, message: f.message ?? 'Error interno', details: det });
                return;
            }

            // Validación Fastify/AJV (si aplica)
            if (error?.validation?.length) {
                const details = error.validation.map((v: any) => ({
                    field: v?.instancePath?.slice(1) || v?.params?.missingProperty || 'unknown',
                    message: v?.message || 'Campo inválido',
                }));
                reply.status(422).send({ statusCode: 422, message: 'Datos inválidos.', details });
                return;
            }

            // CustomError directo
            if (error instanceof CustomError) {
                const status = Number(error.statusCode) || 422;
                const det = Array.isArray((error as any).details) ? stripCode((error as any).details) : undefined;
                reply.status(status).send({ statusCode: status, message: error.message, details: det });
                return;
            }

            // Fallback desconocido
            reply.status(500).send({ statusCode: 500, message: 'Error interno' });
        });
    }

    addModule = async (module: IModule): Promise<void> => {
        const prefix = `/${ENV.DOMAIN}/${ENV.SERVICE_NAME}`;
        const plugin: FastifyPluginAsync = async (router) => {
            const rutas = module.getRutas();

            for (const idx in rutas) {
                const ruta = rutas[idx];
                const url = ruta.url;
                const schema = ruta?.schema ?? {};

                const handler = async (req: FastifyRequest<any>, reply: FastifyReply) => {
                    const request = {
                        headers: { ...(req.headers as Record<string, unknown>) },
                        data: {
                            ...(req.body as Record<string, unknown>),
                            ...(req.params as Record<string, unknown>),
                            ...(req.query as Record<string, unknown>),
                        },
                    };
                    const result = await ruta.evento(request);
                    reply.status(result.status).send(result.response);
                };

                switch (ruta.metodo) {
                    case HTTPMETODO.POST:
                        router.post(url, schema, handler);
                        break;
                    case HTTPMETODO.PUT:
                        router.put(url, schema, handler);
                        break;
                    case HTTPMETODO.PATCH:
                        router.patch(url, schema, handler);
                        break;
                    case HTTPMETODO.DELETE:
                        router.delete(url, schema, handler);
                        break;
                    case HTTPMETODO.GET:
                    default:
                        router.get(url, schema, handler);
                        break;
                }
            }
        };

        this.app.register(plugin, { prefix: prefix + module.ruta });
    };

    start = async (): Promise<void> => {
        await this.app.listen({ port: this.port });
        console.log(`Application running on port ${this.port}`);
    };
}
