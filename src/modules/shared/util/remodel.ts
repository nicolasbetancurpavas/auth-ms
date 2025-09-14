import { CreateUserInput } from '@modules/Auth/domain/repositories/UserRepository';
import { IRegisterUser } from '@modules/Auth/interfaces/IRegisterUser';
export const buildCreate = (input: IRegisterUser, passwordHash: string): CreateUserInput => ({
    name: input.name.trim(),
    email: input.email.toLowerCase().trim(),
    rol: (input.rol ?? 'user') as 'user' | 'admin',
    passwordHash,
});
