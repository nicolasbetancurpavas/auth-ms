export default class CustomError extends Error {
    private code: number;
    public isCustomError: boolean;
    public details?: unknown;

    constructor(message: string, code = 500, isCustomErrorOrDetails?: boolean | unknown, maybeDetails?: unknown) {
        super(message);
        this.name = 'CustomError';
        this.code = Number(code) || 500;

        if (typeof isCustomErrorOrDetails === 'boolean') {
            this.isCustomError = isCustomErrorOrDetails;
            if (maybeDetails !== undefined) this.details = maybeDetails;
        } else {
            this.isCustomError = true; // por defecto es “custom”
            if (isCustomErrorOrDetails !== undefined) this.details = isCustomErrorOrDetails;
        }

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace?.(this, CustomError);
    }

    get statusCode(): number {
        return this.code;
    }
    set statusCode(v: number) {
        this.code = Number(v) || 500;
    } // tolera asignaciones legadas

    toResponse() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            details: this.details,
            isError: true,
        };
    }
}
