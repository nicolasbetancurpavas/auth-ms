/* eslint-disable */
import { fastify, FastifyInstance, FastifyReply, FastifyRequest, FastifyPluginAsync } from 'fastify';
import fastifyCors from '@fastify/cors';
import { randomBytes } from 'crypto';
import { IModule } from '@common/modules/IModule';
import { HTTPMETODO } from '@common/modules/Ruta';
import { ENV } from '@modules/shared';
import { AuthErrorDictionary, AuthException } from '@common/http/exceptions';

export class FastifyServer {
    port: number = +ENV.PORT;
    app: FastifyInstance;

    constructor() {
        this.app = fastify({
            logger: true,
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
        this.app.setErrorHandler((error: any, req, reply): void => {
            const stripCode = (arr: any[]) => arr.map(({ code, ...rest }) => rest);
            const reqId = (req as any)?.id;

            // 1) Errores con toResponse()
            if (typeof error?.toResponse === 'function') {
                const f = error.toResponse();
                const status = Number(f.statusCode) || 500;
                const detSrc = Array.isArray(f.details)
                    ? f.details
                    : Array.isArray((f as any).errors)
                    ? (f as any).errors
                    : undefined;
                const details = Array.isArray(detSrc) ? stripCode(detSrc) : undefined;

                reply.code(status).send({
                    statusCode: status,
                    message: f.message ?? 'Error interno',
                    details,
                    reqId,
                });
                return; // <-- importante: no devolver FastifyReply, solo terminar
            }

            // 2) Validaciones AJV/Fastify
            if (error?.validation?.length) {
                const details = error.validation.map((v: any) => ({
                    field: v?.instancePath?.slice(1) || v?.params?.missingProperty || v?.params?.key || 'unknown',
                    message: v?.message || 'Campo inválido',
                }));

                reply.code(422).send({
                    statusCode: 422,
                    message: 'Datos inválidos.',
                    details,
                    reqId,
                });
                return;
            }

            // 3) CustomError
            if (error instanceof AuthException) {
                const dict = AuthErrorDictionary[error.code] ?? {
                    status: 500,
                    message: 'Error interno',
                };

                reply.code(dict.status).send({
                    statusCode: dict.status,
                    message: dict.message,
                    code: error.code,
                    reqId,
                });
                return;
            }

            // 4) Errores de Postgres (pg/pg-promise)
            const pgCode: string | undefined = error?.code;
            if (pgCode) {
                const PG_MAP: Record<string, { status: number; msg: string }> = {
                    '23505': { status: 409, msg: 'Registro duplicado' },
                    '23503': { status: 409, msg: 'Violación de llave foránea' },
                    '23502': { status: 400, msg: 'Campo requerido no puede ser NULL' },
                    '23514': { status: 422, msg: 'Violación de restricción CHECK' },
                    '22P02': { status: 400, msg: 'Formato inválido en el valor' },
                    '42703': { status: 500, msg: 'Columna no existe' },
                    '42P01': { status: 500, msg: 'Tabla no existe' },
                };
                const mapped = PG_MAP[pgCode] ?? { status: 500, msg: 'Error en la base de datos' };

                const body: any = {
                    statusCode: mapped.status,
                    message: mapped.msg,
                    reqId,
                };
                if (error.detail) body.detail = error.detail;
                if (error.table) body.table = error.table;
                if (error.constraint) body.constraint = error.constraint;
                if (process.env.NODE_ENV !== 'production') {
                    body.code = pgCode;
                    if (error.routine) body.routine = error.routine;
                }

                reply.code(mapped.status).send(body);
                return;
            }

            // 5) Fallback
            reply.code(500).send({ statusCode: 500, message: 'Error interno ${error}', reqId });
            // sin return de FastifyReply
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
        console.log(this.app.printRoutes());
    };
}
