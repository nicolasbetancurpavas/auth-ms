import Joi from 'joi';

type Schema = Joi.ObjectSchema<any> | Joi.ArraySchema<any>;
type Body = unknown;

export const validateData = <T>(schema: Schema, dataToValidate: Body, options?: Joi.ValidationOptions): T => {
    const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
        ...options,
    });

    if (error) {
        throw error;
    }
    return value as T;
};
