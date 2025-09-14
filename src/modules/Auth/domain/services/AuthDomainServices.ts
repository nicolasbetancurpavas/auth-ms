import { UserVM } from '../entities/DataInterface';

export interface PasswordHasher {
    hash(plain: string): Promise<string>;
    compare(plain: string, hash: string): Promise<boolean>;
}

export interface TokenService {
    sign(payload: object, opts?: { expiresIn?: string }): string;
    verify<T = any>(token: string): T;
}

export interface UserRepository {
    findByEmail(email: string): Promise<(UserVM & { passwordHash: string }) | null>;
    create(input: { nombre: string; email: string; passwordHash: string; rol: 'user' | 'admin' }): Promise<UserVM>;
}
