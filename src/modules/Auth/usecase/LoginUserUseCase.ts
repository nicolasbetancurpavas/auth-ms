import { inject, injectable } from 'inversify';
import TYPESDEPENDENCIES from '../dependencies/TypesDependencies';
import { IRegisterUser } from '../interfaces/IRegisterUser';
import { UserVM } from '../domain/entities/DataInterface';
import { UserRepository } from '../domain/repositories/TenancyRepository';
import { PasswordHasher } from '../domain/services/AuthDomainServices';

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
        const exists = await this.userRepo.findByEmail(email);
        if (exists) {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }
        const passwordHash = await this.hasher.hash(input.password);
        const user = await this.userRepo.create({
            nombre: input.nombre.trim(),
            email,
            passwordHash,
            rol,
        });
        return user;
    }
}
