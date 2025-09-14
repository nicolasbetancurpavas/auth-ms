import { PasswordHasher } from '@modules/Auth/domain/services/AuthDomainServices';
import bcrypt from 'bcrypt';

export default class BcryptPasswordHasher implements PasswordHasher {
    constructor(private readonly rounds = 10) {}
    hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, this.rounds);
    }
    compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}
