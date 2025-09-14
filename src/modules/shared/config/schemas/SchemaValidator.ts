import Joi from 'joi';
import { PubSubPayload, pubSubSchema } from './PubSubSchema';
import { BadMessageException, BadMessagePubSubException, LNException } from '@common/http/exceptions';
import { decode } from '@common/utils/base64';
import { parse } from '@common/utils';

type Schema = Joi.ObjectSchema | Joi.ArraySchema;
type Body = Record<string, unknown> | undefined | unknown;

export const validateData = <T>(schema: Schema, dataToValidate: Body): T => {
    if (dataToValidate) {
        const { error, value } = schema.validate(dataToValidate, { convert: true });
        if (error) {
            throw new BadMessageException(error.message, 'Los valores de entrada no son correctos.');
        }
        return value;
    }
    throw new LNException(
        'No se enviaron datos para validar.',
        'Los datos de entrada son obligatorios para la validación.',
        'Validación sin datos',
        400,
    );
};

export const validateDataPubSub = <T>(schema: Schema, dataToValidate: Body): T => {
    if (dataToValidate) {
        const pubSubPayload = validatePubSub(dataToValidate);
        if (pubSubPayload) {
            const decodeMessage = parse(decode(pubSubPayload.message.data));

            const { error, value } = schema.validate(decodeMessage, {
                convert: true,
            });
            if (error) {
                throw new BadMessagePubSubException(error.message);
            }
            return value;
        }
    }
    throw new BadMessagePubSubException(
        'mensaje indefinido',
        'No hay mensaje o data para validar, reintente con un mensaje diferente.',
    );
};

export const validatePubSub = (dataToValidate: Body, isPubSub?: string | null): PubSubPayload | null => {
    if (dataToValidate && isPubSub !== null) {
        const { error, value } = pubSubSchema.validate(dataToValidate, {
            convert: true,
        });
        if (!error) return value;
        throw new BadMessagePubSubException(error.message);
    }
    return null;
};
