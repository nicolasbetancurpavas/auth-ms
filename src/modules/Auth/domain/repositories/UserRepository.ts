import { UserRole, UserVM } from '../entities/DataInterface';

export interface CreateUserInput {
    name: string;
    email: string;
    passwordHash: string;
    rol: UserRole;
}
export interface UserRepository {
    findByEmail(email: string): Promise<(UserVM & { passwordHash: string }) | null>;
    create(input: CreateUserInput): Promise<UserVM>;
}
