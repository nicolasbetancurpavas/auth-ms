import { UserAuth, UserVM } from '@modules/Auth/domain/entities/DataInterface';

export interface UserRow {
    id: number;
    nombre: string;
    email: string;
    rol: 'user' | 'admin';
    password_hash: string;
}

export const toUserVM = (row: UserRow): UserVM => ({
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    rol: row.rol,
});

export const toUserAuth = (row: UserRow): UserAuth => ({
    ...toUserVM(row),
    passwordHash: row.password_hash,
});
