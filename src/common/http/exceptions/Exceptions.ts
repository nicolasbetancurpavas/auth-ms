import { ErrorCode, StatusCode } from './ErrorCode';

export abstract class Exception {
    isError: boolean;
    message: string;
    code: ErrorCode;
    statusCode: number;
    cause: string | null;

    constructor(message: string, code: ErrorCode, statusCode: number, cause?: string) {
        this.isError = true;
        this.message = message;
        this.code = code;
        this.statusCode = statusCode;
        this.cause = cause || null;
    }
}

export class LNException extends Exception {
    public readonly internalCode: string;

    constructor(message: string, internalCode: string, cause: string, statusCode?: number) {
        super(message, ErrorCode.LOGICA_NEGOCIO_ERROR, statusCode ?? StatusCode.OK, cause);
        this.internalCode = internalCode;
    }
}

export class BadMessageException extends Exception {
    constructor(cause: string, message: string) {
        super(message, ErrorCode.BAD_MESSAGE, StatusCode.BAD_REQUEST, cause);
    }
}

export class BadMessagePubSubException extends Exception {
    constructor(cause: string, message = 'Los datos de entrada no corresponden con el esquema definido') {
        super(message, ErrorCode.BAD_MESSAGE, StatusCode.BAD_REQUEST, cause);
    }
}

export class AxiosError extends Exception {
    constructor(message: string, cause?: string) {
        super(message, ErrorCode.AXIOS_ERROR, StatusCode.INTERNAL_ERROR, cause);
    }
}
export class ApiError extends Exception {
    constructor(message: string, cause?: string) {
        super(message, ErrorCode.API_ERROR, StatusCode.INTERNAL_ERROR, cause);
    }
}

export class PostgresError extends Exception {
    constructor(message: string) {
        const fsError = ErrorCode.REPOSITORY_ERROR;
        super(message, ErrorCode.POSTGRES_ERROR, StatusCode.INTERNAL_ERROR, fsError);
    }
}
export class RedisError extends Exception {
    constructor(message: string) {
        const fsError = ErrorCode.REDIS_ERROR;
        super(message, ErrorCode.REDIS_ERROR, StatusCode.INTERNAL_ERROR, fsError);
    }
}

export class RepositoryException extends Exception {
    constructor() {
        const message = 'Ocurrió un error al momento de guardar la guía';
        super(message, ErrorCode.REPOSITORY_ERROR, StatusCode.INTERNAL_ERROR);
    }
}

export class PubSubException extends Exception {
    constructor(message: string, cause: string) {
        super(message, ErrorCode.PUBSUB_ERROR, StatusCode.INTERNAL_ERROR, cause);
    }
}

export class FirestoreException extends Exception {
    constructor(code: number | string | undefined, message: string) {
        const fsError = ErrorCode.REPOSITORY_ERROR;
        switch (code) {
            case 1:
            case '1':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Firestore action cancelled');
                break;
            case 2:
            case '2':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Firestore unknown error');
                break;
            case 3:
            case '3':
                super(message, fsError, StatusCode.OK, 'Firestore invalid argument');
                break;
            case 4:
            case '4':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Firestore deadline exceeded');
                break;
            case 5:
            case '5':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Update nonexistent document');
                break;
            case 6:
            case '6':
                super(message, fsError, StatusCode.OK, 'Firestore document already exists');
                break;
            case 7:
            case '7':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Firestore permission denied');
                break;
            case 8:
            case '8':
                super(message, fsError, StatusCode.OK, 'Firestore resource exhausted');
                break;
            case 9:
            case '9':
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Firestore precondition failed');
                break;
            default:
                super(message, fsError, StatusCode.INTERNAL_ERROR, 'Defaulted unkwnown fs error');
                break;
        }
    }
}
