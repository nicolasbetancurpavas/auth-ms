import Joi from 'joi';
import { ILoginUser } from '../interfaces/ILoginUser';

export const loginParamsSchema = Joi.object<ILoginUser>({
    email: Joi.string().email().required().messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email es obligatorio',
    }),
    password: Joi.string().min(10).max(72).required().messages({
        'string.min': 'La contraseña debe tener mínimo 10 caracteres',
        'any.required': 'La contraseña es obligatoria',
    }),
});
