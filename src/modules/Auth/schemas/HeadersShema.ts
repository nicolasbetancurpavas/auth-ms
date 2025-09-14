import Joi from 'joi';

const contentTypeJson = /^application\/json(?:\s*;.*)?$/i;
const acceptJson = /^(?:\*\/\*|application\/json)(?:\s*;.*)?$/i;
const langRegex = /^[a-z]{2}(?:-[A-Z]{2})?$/;
export const bearerRegex = /^Bearer\s+[A-Za-z0-9\-_+=]+\.[A-Za-z0-9\-_+=]+\.[A-Za-z0-9\-_+=]+$/;
const withinSkew = () =>
    Joi.date()
        .iso()
        .required()
        .custom((value) => {
            return value;
        }, 'timestamp skew check')
        .messages({
            'date.base': 'X-Timestamp debe ser una fecha ISO-8601',
            'any.required': 'X-Timestamp es obligatorio',
        });

// Base para endpoints JSON (register/login)
export const baseHeadersSchema = Joi.object({
    'content-type': Joi.string().pattern(contentTypeJson).required().messages({
        'any.required': 'Content-Type es obligatorio',
        'string.pattern.base': 'Content-Type debe ser application/json',
    }),
    accept: Joi.string().pattern(acceptJson).required().messages({
        'any.required': 'Accept es obligatorio',
        'string.pattern.base': 'Accept debe permitir application/json',
    }),
    'x-request-id': Joi.string()
        .guid({ version: ['uuidv4', 'uuidv5'] })
        .required()
        .messages({
            'any.required': 'X-Request-Id es obligatorio',
            'string.guid': 'X-Request-Id debe ser un UUID v4/v5',
        }),
    'x-timestamp': withinSkew(), // cambia 5 si quieres otra ventana

    // Opcionales útiles
    'accept-language': Joi.string().pattern(langRegex).default('es').messages({
        'string.pattern.base': 'Accept-Language debe ser como "es" o "es-CO"',
    }),
    'x-client-platform': Joi.string().valid('web', 'android', 'ios', 'service').default('web'),
    'user-agent': Joi.string().min(3).max(200).optional(),
    'x-api-version': Joi.string().default('v1'),
}).unknown(true); // no rechazamos otros headers

// Register/Login
export const registerHeadersSchema = baseHeadersSchema;
export const loginHeadersSchema = baseHeadersSchema;

// Endpoints protegidos: requieren Bearer
export const authHeadersSchema = baseHeadersSchema.keys({
    authorization: Joi.string().pattern(bearerRegex).required().messages({
        'any.required': 'Authorization es obligatorio',
        'string.pattern.base': 'Authorization debe ser "Bearer <token>"',
    }),
});

// Helper para extraer el token
export const extractBearer = (authorization: string) => authorization.replace(/^Bearer\s+/i, '');
