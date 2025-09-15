import Joi from 'joi';
import CustomError from '@common/utils/CustomError';

type Schema = Joi.ObjectSchema<any> | Joi.ArraySchema<any>;
type Body = unknown;

const JOI_OPTS: Joi.ValidationOptions = {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
    errors: { label: 'key' },
};

const mapJoiDetails = (details: Joi.ValidationErrorItem[]) =>
    details.map((d) => ({
        field: (d.context?.key ?? (Array.isArray(d.path) ? d.path[0] : d.path)) as string,
        message: String(d.message ?? '').replace(/"/g, ''),
    }));

export const validateData = <T>(schema: Schema, data: Body, options?: Joi.ValidationOptions): T => {
    const { error, value } = schema.validate(data, { ...JOI_OPTS, ...options });
    if (!error) return value as T;
    throw new CustomError('Datos inválidos.', 422, true, mapJoiDetails(error.details));
};

export const normalizeHeaders = (h: unknown): Record<string, unknown> => {
    if (!h || typeof h !== 'object') return {};
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(h as Record<string, unknown>)) out[String(k).toLowerCase()] = v;
    return out;
};

export const validateHeaders = <T>(
    schema: Joi.ObjectSchema<T>,
    headers: unknown,
    options?: Joi.ValidationOptions,
): T => {
    const norm = normalizeHeaders(headers);
    const { error, value } = schema.validate(norm, { ...JOI_OPTS, stripUnknown: false, ...options });
    if (!error) return value as T;
    throw new CustomError('Headers inválidos.', 400, true, mapJoiDetails(error.details));
};
