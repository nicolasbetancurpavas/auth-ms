import Joi from 'joi';
import { IRegisterUser } from '../interfaces/IRegisterUser';

const sequential = /(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwerty|asdf)/i;
const repeated = /(.)\1{2,}/;
const commons = new Set(['password', '123456', 'qwerty', 'admin', 'welcome', 'abc123', '111111']);

export const registerParamsSchema = Joi.object<IRegisterUser>({
    name: Joi.string().min(2).max(100).required().messages({
        'string.base': 'El campo name debe ser texto',
        'string.empty': 'El campo name no puede estar vacio',
        'any.required': 'El campo name es obligatorio',
    }),

    email: Joi.string().email().required().messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El campo email es obligatorio',
    }),

    password: Joi.string()
        .min(10)
        .max(72)
        .pattern(/[a-z]/, 'minúscula')
        .pattern(/[A-Z]/, 'mayúscula')
        .pattern(/[0-9]/, 'número')
        .pattern(/[^A-Za-z0-9]/, 'carácter especial')
        .pattern(/^\S+$/, 'sin espacios')
        .custom((value, helpers) => {
            const data = helpers.state.ancestors[0] || {};
            const name = String(data.nombre ?? '').toLowerCase();
            const user = String((data.email ?? '').split('@')[0] ?? '').toLowerCase();
            const v = String(value).toLowerCase();

            if (commons.has(v)) return helpers.error('password.common');
            if (sequential.test(v)) return helpers.error('password.seq');
            if (repeated.test(v)) return helpers.error('password.repeat');
            if (name && v.includes(name)) return helpers.error('password.personal');
            if (user && v.includes(user)) return helpers.error('password.personal');
            return value;
        })
        .required()
        .messages({
            'string.min': 'La password debe tener mínimo 10 caracteres',
            'string.max': 'La password no debe superar 72 caracteres (límite de bcrypt)',
            'string.pattern.name': 'La password debe incluir al menos una {#name}',
            'string.pattern.base': 'La password no cumple el formato requerido',
            'password.common': 'La password es demasiado común',
            'password.seq': 'Evita secuencias como 1234 o abcd',
            'password.repeat': 'Evita repetir caracteres (aaa, 111, ...)',
            'password.personal': 'No uses tu nombre o tu usuario de email en la contraseña',
            'any.required': 'El campo password es obligatorio',
        }),

    rol: Joi.string().valid('user', 'admin').default('user').messages({
        'any.only': "El rol debe ser 'user' o 'admin'",
    }),
});
