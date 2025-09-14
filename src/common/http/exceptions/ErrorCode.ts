export enum AuthErrorCode {
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    MISSING_TOKEN = 'MISSING_TOKEN',
    INVALID_TOKEN = 'INVALID_TOKEN',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    FORBIDDEN_ROLE = 'FORBIDDEN_ROLE',
    RATE_LIMITED = 'RATE_LIMITED',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
}
export const AuthErrorDictionary: Record<AuthErrorCode, { status: number; codeLN: string; message: string }> = {
    [AuthErrorCode.EMAIL_ALREADY_EXISTS]: { status: 409, codeLN: 'AU409-01', message: 'El email ya está registrado.' },
    [AuthErrorCode.INVALID_CREDENTIALS]: { status: 401, codeLN: 'AU401-01', message: 'Credenciales inválidas.' },
    [AuthErrorCode.MISSING_TOKEN]: { status: 401, codeLN: 'AU401-02', message: 'Falta token Bearer.' },
    [AuthErrorCode.INVALID_TOKEN]: { status: 401, codeLN: 'AU401-03', message: 'Token inválido.' },
    [AuthErrorCode.TOKEN_EXPIRED]: { status: 401, codeLN: 'AU401-04', message: 'Token expirado.' },
    [AuthErrorCode.USER_NOT_FOUND]: { status: 404, codeLN: 'AU404-01', message: 'Usuario no encontrado.' },
    [AuthErrorCode.FORBIDDEN_ROLE]: { status: 403, codeLN: 'AU403-01', message: 'No puedes asignarte ese rol.' },
    [AuthErrorCode.RATE_LIMITED]: { status: 429, codeLN: 'AU429-01', message: 'Demasiados intentos.' },
    [AuthErrorCode.INTERNAL_ERROR]: { status: 500, codeLN: 'AU500-00', message: 'Error interno.' },
};
