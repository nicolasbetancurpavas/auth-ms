export interface Ruta {
    metodo: HTTPMETODO; // usa el enum directamente
    url: string;
    evento: (...args: any[]) => Promise<any> | any; // handler de la ruta
    handler?: Record<string, unknown>;
    schema?: Record<string, unknown>;
}

// Derivado del enum para mantener consistencia si agregas métodos
export type HTTPMETODOTYPE = `${HTTPMETODO}`;

export enum HTTPMETODO {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch',
    OPTIONS = 'options',
    HEAD = 'head',
}

export enum HTTPSTATUSCODE {
    // 2xx
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,

    // 4xx
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    PRECONDITION_FAILED = 412,
    UNPROCESSABLE_ENTITY = 422,

    // 5xx
    INTERNAL = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}
