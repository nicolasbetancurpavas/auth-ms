import Joi from 'joi';
import { IRegisterUser } from '../interfaces/IRegisterUser';

const sequential = /(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwerty|asdf)/i;
const repeated = /(.)\1{2,}/;
const commons = new Set(['password', '123456', 'qwerty', 'admin', 'welcome', 'abc123', '111111']);

export const registerParamsSchema = Joi.object<IRegisterUser>({
    name: Joi.string().min(5).max(100).required().messages({
        'string.base': 'El campo nombre debe ser texto',
        'string.empty': 'El campo nombre no puede estar vacio',
        'any.required': 'El campo nombre es obligatorio',
    }),

    email: Joi.string().email().required().messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El campo email es obligatorio',
        'string.empty': 'El campo email no puede estar vacio',
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
            'string.min': 'La contraseña debe tener mínimo 10 caracteres',
            'string.max': 'La contraseña no debe superar 72 caracteres (límite de bcrypt)',
            'string.pattern.name': 'La contraseña debe incluir al menos una {#name}',
            'string.pattern.base': 'La contraseña no cumple el formato requerido',
            'password.common': 'La contraseña es demasiado común',
            'password.seq': 'Evita secuencias como 1234 o abcd',
            'password.repeat': 'Evita repetir caracteres (aaa, 111, ...)',
            'password.personal': 'No uses tu nombre o tu usuario de email en la contraseña',
            'any.required': 'El campo contraseña es obligatorio',
            'string.empty': 'El campo contraseña no puede estar vacio',
        }),

    rol: Joi.string().valid('user', 'admin').default('user').messages({
        'any.only': "El rol debe ser 'user' o 'admin'",
    }),
});
