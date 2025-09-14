import { HTTPSTATUSCODE } from '@common/modules/Ruta';
import { Response } from './Response';

export default class Result {
    static ok<T>(data: T): Response<T> {
        return {
            isError: false,
            response: data,
            status: HTTPSTATUSCODE.OK,
        };
    }
    static notOk<T>(data: T): Response<T> {
        return {
            isError: false,
            response: data,
            status: HTTPSTATUSCODE.BAD_REQUEST,
        };
    }
    static dinamicResponse<T>(data: T, status: number): Response<T> {
        return {
            isError: false,
            response: data,
            status,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    static failure<T>(exception: any): Response<T> {
        const response = { message: exception?.message || 'unknown' };
        return {
            isError: true,
            response,
            status: exception.status || HTTPSTATUSCODE.INTERNAL,
        };
    }
}
