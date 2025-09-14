import { UserAuth, UserVM } from '@modules/Auth/domain/entities/DataInterface';
import { CreateUserInput } from '@modules/Auth/domain/repositories/UserRepository';

export interface UserRow {
    id: number;
    nombre: string;
    email: string;
    rol: 'user' | 'admin';
    password_hash: string;
}

export const toUserVM = (row: UserRow): UserVM => ({
    id: row.id,
    name: row.nombre,
    email: row.email,
    rol: row.rol,
});

export const toUserAuth = (row: UserRow): UserAuth => ({
    ...toUserVM(row),
    passwordHash: row.password_hash,
});

export const toCreateUserParams = (input: CreateUserInput) =>
    [input.name, input.email, input.rol, input.passwordHash] as const;
