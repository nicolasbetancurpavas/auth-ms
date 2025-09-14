import Joi from 'joi';
import { IRegisterUser } from '../interfaces/IRegisterUser';

export const authParamsSchema = Joi.object<IRegisterUser>({
    nombre: Joi.string().min(2).max(100).required().messages({
        'string.base': 'El nombre debe ser texto',
        'string.empty': 'El nombre no puede estar vacio',
        'any.required': 'El campo nombre es obligatorio',
    }),

    email: Joi.string().email().required().messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El campo email es obligatorio',
    }),

    password: Joi.string().min(6).required().messages({
        'string.min': 'La contraseña debe tener mínimo 6 caracteres',
        'any.required': 'El campo contraseña es obligatorio',
    }),

    rol: Joi.string().valid('user', 'admin').default('user').messages({
        'any.only': "El rol debe ser 'user' o 'admin'",
    }),
});
