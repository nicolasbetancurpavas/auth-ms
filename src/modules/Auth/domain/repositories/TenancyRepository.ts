import { UserVM } from '../entities/DataInterface';

export interface UserRepository {
    findByEmail(email: string): Promise<(UserVM & { passwordHash: string }) | null>;
    create(input: { nombre: string; email: string; passwordHash: string; rol: 'user' | 'admin' }): Promise<UserVM>;
}
