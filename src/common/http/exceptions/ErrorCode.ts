export enum ErrorCode {
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    BAD_MESSAGE = 'BAD_MESSAGE',
    SYNTAX_ERROR = 'SYNTAX_ERROR',
    REPOSITORY_ERROR = 'REPOSITORY_ERROR',
    PUBSUB_ERROR = 'PUBSUB_ERROR',
    POSTGRES_ERROR = 'POSTGRES_ERROR',
    REDIS_ERROR = 'REDIS_ERROR',
    AXIOS_ERROR = 'AXIOS_ERROR',
    API_ERROR = 'API_ERROR',
    LOGICA_NEGOCIO_ERROR = 'LOGICA_NEGOCIO_ERROR',
}

export enum StatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    MULTISTATUS = 207,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    PRECONDITION_FAILED = 412,
    I_AM_A_TEAPOT = 418,
    UNPROCESSABLE_ENTITY = 422,
    FAILED_DEPENDENCY = 424,
    TOO_EARLY = 425,
    PRECONDITION_REQUIRED = 428,
    INTERNAL_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
}

export const LNErrorDictionary = {
    PRECONDITION_FAILED: {
        codeLN: 'LN412',
        message: 'Condición previa incumplida.',
    },
    BAD_REQUEST: {
        codeLN: 'LN400',
        message: 'Estructura inválida o faltante.',
    },
    BUSINESS_LOGIC_FAILED: {
        codeLN: 'LN422',
        message: 'El mensaje no cumple reglas de negocio.',
    },
    CONFLICT: {
        codeLN: 'LN409',
        message: 'El mensaje entra en conflicto con data existente.',
    },
    UNAUTHORIZED: {
        codeLN: 'LN403',
        message: 'Evento no autorizado.',
    },
    INTERNAL_ERROR: {
        codeLN: 'LN500',
        message: 'Fallo general inesperado.',
    },
    SERVICE_UNAVAILABLE: {
        codeLN: 'LN503',
        message: 'Dependencia caída.',
    },
    TIMEOUT: {
        codeLN: 'LN504',
        message: 'Tiempo de espera superado.',
    },
    FINAL_SAVE_FAILED: {
        codeLN: 'LN901',
        message: 'Proceso exitoso pero no se pudo guardar el resultado.',
    },
    PUBLICATION_FAILED: {
        codeLN: 'LN902',
        message: 'Proceso exitoso pero no se pudo publicar al topico.',
    },
    NOT_FOUND: {
        codeLN: 'LN404',
        message: 'El recurso solicitado no fue encontrado.',
    },
};
