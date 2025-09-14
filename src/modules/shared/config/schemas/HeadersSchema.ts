import Joi from 'joi';

export const headersSchema = Joi.object<IHeaders>({
    'x-client-name': Joi.string().required().example('SIGO-REPARTO'),
    'x-client-user': Joi.string().required().example('xxx@xxx.com'),
    'x-request-id': Joi.string().required().example('d1e7fca2-5f83-48a3-bf64-ccbb6529fa7a'),
    'x-timestamp': Joi.string().required().example('2021-09-01T12:00:00.000Z'),
}).unknown(true);

export interface IHeaders {
    'x-client-name': string;
    'x-client-user': string;
    'x-request-id': string;
    'x-timestamp': string;
}
