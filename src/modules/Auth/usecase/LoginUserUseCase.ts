import { inject, injectable } from 'inversify';
import TYPES from '../dependencies/TypesDependencies';
import { ILoginUser } from '../interfaces/ILoginUser';
import { UserRepository } from '../domain/repositories/UserRepository';
import { PasswordHasher, TokenService } from '../domain/services/AuthDomainServices';
import { UserVM } from '../domain/entities/DataInterface';
import { AuthErrorCode, AuthException } from '@common/http/exceptions';

type LoginOutput = { accessToken: string; user: UserVM };

@injectable()
export default class LoginUserUseCase {
    constructor(
        @inject(TYPES.UserRepository) private readonly userRepo: UserRepository,
        @inject(TYPES.PasswordHasher) private readonly hasher: PasswordHasher,
        @inject(TYPES.TokenService) private readonly tokens: TokenService,
    ) {}

    public async execute(input: ILoginUser): Promise<LoginOutput> {
        const email = input.email.toLowerCase().trim();

        const userAuth = await this.userRepo.findByEmail(email);
        if (!userAuth) throw new AuthException(AuthErrorCode.INVALID_CREDENTIALS);

        const ok = await this.hasher.compare(input.password, userAuth.passwordHash);
        if (!ok) throw new AuthException(AuthErrorCode.INVALID_CREDENTIALS);

        const payload = { sub: userAuth.id, email: userAuth.email, rol: userAuth.rol };
        const accessToken = this.tokens.sign(payload);

        const { passwordHash: _omit, ...user } = userAuth;
        return { accessToken, user };
    }
}
