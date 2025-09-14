import { AuthErrorCode, AuthErrorDictionary } from './ErrorCode';

export class AuthException extends Error {
    readonly code: AuthErrorCode;
    readonly status: number;
    readonly details?: unknown;

    constructor(code: AuthErrorCode, details?: unknown) {
        const meta = AuthErrorDictionary[code];
        super(meta.message);
        this.name = 'AuthException';
        this.code = code;
        this.status = meta.status;
        this.details = details;
        Error.captureStackTrace?.(this, AuthException);
    }
}
