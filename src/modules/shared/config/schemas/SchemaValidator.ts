// src/common/utils/validateData.ts
import Joi, { ObjectSchema, ValidationErrorItem } from 'joi';
import CustomError from '@common/utils/CustomError';

const JOI_OPTS: Joi.ValidationOptions = {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
    errors: { label: 'key' },
};

const mapJoiDetails = (details: ValidationErrorItem[]) =>
    details.map((d) => ({
        field: (d.context?.key ?? (Array.isArray(d.path) ? d.path[0] : d.path)) as string,
        message: String(d.message ?? '').replace(/"/g, ''),
    }));

export const validateData = <T>(schema: ObjectSchema, data: unknown): T => {
    const { error, value } = schema.validate(data, JOI_OPTS);
    if (!error) return value as T;

    throw new CustomError('Datos inválidos.', 422, true, mapJoiDetails(error.details));
};
