import Joi from 'joi';

type Schema = Joi.ObjectSchema<any> | Joi.ArraySchema<any>;
type Body = unknown;

// Normaliza claves de headers a minúsculas
export const normalizeHeaders = (h: unknown): Record<string, unknown> => {
    if (!h || typeof h !== 'object') return {};
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(h as Record<string, unknown>)) {
        out[String(k).toLowerCase()] = v;
    }
    return out;
};

// Valida body (ya lo tienes, por si quieres mantener todo junto)
export const validateData = <T>(schema: Schema, dataToValidate: Body, options?: Joi.ValidationOptions): T => {
    const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
        ...options,
    });
    if (error) throw error;
    return value as T;
};

// Valida headers
export const validateHeaders = <T>(
    schema: Joi.ObjectSchema<T>,
    headers: unknown,
    options?: Joi.ValidationOptions,
): T => {
    const norm = normalizeHeaders(headers);
    const { error, value } = schema.validate(norm, {
        abortEarly: false,
        stripUnknown: false, // no borramos headers desconocidos
        convert: true,
        ...options,
    });
    if (error) throw error; // tu mapper ya convierte ValidationError -> 400
    return value as T;
};
