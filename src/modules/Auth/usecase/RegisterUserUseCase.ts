import { inject, injectable } from 'inversify';
import TYPESDEPENDENCIES from '../dependencies/TypesDependencies';
import { IRegisterUser } from '../interfaces/IRegisterUser';
import { UserVM } from '../domain/entities/DataInterface';
import { UserRepository } from '../domain/repositories/UserRepository';
import { PasswordHasher } from '../domain/services/AuthDomainServices';
import { AuthErrorCode, AuthException } from '@common/http/exceptions';

@injectable()
export default class RegisterUserUseCase {
    constructor(
        @inject(TYPESDEPENDENCIES.UserRepository)
        private readonly userRepo: UserRepository,
        @inject(TYPESDEPENDENCIES.PasswordHasher)
        private readonly hasher: PasswordHasher,
    ) {}

    public async execute(input: IRegisterUser): Promise<UserVM> {
        const email = input.email.toLowerCase().trim();
        const rol = input.rol ?? 'user';
        if (await this.userRepo.findByEmail(email)) throw new AuthException(AuthErrorCode.EMAIL_ALREADY_EXISTS);
        const passwordHash = await this.hasher.hash(input.password);
        const user = await this.userRepo.create({
            name: input.name.trim(),
            email,
            passwordHash,
            rol,
        });
        return user;
    }
}
