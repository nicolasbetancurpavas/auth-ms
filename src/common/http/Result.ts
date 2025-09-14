import { HTTPSTATUSCODE } from '@common/modules/Ruta';
import { Response } from './Response';

type ErrorPayload = {
    code?: string;
    codeLN?: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any;
};

export default class Result {
    // 2xx
    static ok<T>(data: T): Response<T> {
        return { isError: false, response: data, status: HTTPSTATUSCODE.OK };
    }

    static created<T>(data: T): Response<T> {
        return { isError: false, response: data, status: HTTPSTATUSCODE.CREATED };
    }

    static noContent(): Response<undefined> {
        return { isError: false, response: undefined, status: HTTPSTATUSCODE.NO_CONTENT };
    }

    // Helpers genéricos
    static withStatus<T>(status: number, data: T): Response<T> {
        return { isError: false, response: data, status };
    }

    // 4xx
    static badRequest<T extends ErrorPayload | string = ErrorPayload>(
        data: T,
    ): Response<T extends string ? ErrorPayload : T> {
        const payload = (typeof data === 'string' ? { message: data } : data) as any;
        return { isError: true, response: payload, status: HTTPSTATUSCODE.BAD_REQUEST };
    }

    static unauthorized<T extends ErrorPayload | string = ErrorPayload>(data: T) {
        const payload = (typeof data === 'string' ? { message: data } : data) as any;
        return { isError: true, response: payload, status: HTTPSTATUSCODE.UNAUTHORIZED };
    }

    static forbidden<T extends ErrorPayload | string = ErrorPayload>(data: T) {
        const payload = (typeof data === 'string' ? { message: data } : data) as any;
        return { isError: true, response: payload, status: HTTPSTATUSCODE.FORBIDDEN };
    }

    static notFound<T extends ErrorPayload | string = ErrorPayload>(data: T) {
        const payload = (typeof data === 'string' ? { message: data } : data) as any;
        return { isError: true, response: payload, status: HTTPSTATUSCODE.NOT_FOUND };
    }

    static conflict<T extends ErrorPayload | string = ErrorPayload>(data: T) {
        const payload = (typeof data === 'string' ? { message: data } : data) as any;
        return { isError: true, response: payload, status: HTTPSTATUSCODE.CONFLICT };
    }

    // 5xx
    static internal<T extends ErrorPayload | string = ErrorPayload>(data: T = 'INTERNAL_ERROR' as T) {
        const payload = (typeof data === 'string' ? { message: data } : data) as any;
        return { isError: true, response: payload, status: HTTPSTATUSCODE.INTERNAL };
    }

    // Catch–all para errores lanzados
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static failure(exception: any): Response<ErrorPayload> {
        const status =
            (typeof exception?.status === 'number' && exception.status) ||
            (typeof exception?.statusCode === 'number' && exception.statusCode) ||
            HTTPSTATUSCODE.INTERNAL;

        const payload: ErrorPayload = {
            code: exception?.code ?? exception?.name,
            codeLN: exception?.codeLN,
            message: exception?.message ?? 'INTERNAL_ERROR',
            details: exception?.details,
        };

        return { isError: true, response: payload, status };
    }
}
