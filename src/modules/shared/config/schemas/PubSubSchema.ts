import { HeadersSchema } from '@common/domain/entities/interfaces';
import Joi from 'joi';
import { headersSchema } from './HeadersSchema';

export interface PubSubPayload {
    message: Message;
}

interface Message {
    data: string;
    publishTime: string;
    messageId: string;
    attributes: HeadersSchema;
}

export const pubSubSchema = Joi.object<PubSubPayload>({
    message: Joi.object({
        data: Joi.string().required(),
        publishTime: Joi.string().required(),
        messageId: Joi.string().required(),
        attributes: headersSchema.required(),
    })
        .unknown(true)
        .required(),
}).unknown(true);
