import TYPESDEPENDENCIES from './TypesDependencies';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { IDatabase, IMain } from 'pg-promise';
import { db } from '@infrastructure/bd';
import { pubsubV2 } from '@infrastructure/pubsub';
import { PubSub } from '@google-cloud/pubsub';
import LoginUserUseCase from '../usecase/LoginUserUseCase';
import AuthRouter from '../controllers/AuthRouter';
import { UserRepository } from '../domain/repositories/UserRepository';
import UserDAO from '@infrastructure/bd/postgresql/dao/authDAO';
import { PasswordHasher, TokenService } from '../domain/services/AuthDomainServices';
import BcryptPasswordHasher from '@infrastructure/security/adapters/BcryptPasswordHasher';
import RegisterUserUseCase from '../usecase/RegisterUserUseCase';
import JwtTokenService from '@infrastructure/security/adapters/JwtTokenService';

const createDependencies = (): void => {
    GLOBAL_CONTAINER.bind<IDatabase<IMain>>(TYPESDEPENDENCIES.Postgresql).toConstantValue(db);
    GLOBAL_CONTAINER.bind<RegisterUserUseCase>(TYPESDEPENDENCIES.RegisterUserUseCase)
        .to(RegisterUserUseCase)
        .inSingletonScope();
    GLOBAL_CONTAINER.bind<LoginUserUseCase>(TYPESDEPENDENCIES.LoginUserUseCase).to(LoginUserUseCase).inSingletonScope();
    GLOBAL_CONTAINER.bind<UserRepository>(TYPESDEPENDENCIES.UserRepository).to(UserDAO).inSingletonScope();
    GLOBAL_CONTAINER.bind<PasswordHasher>(TYPESDEPENDENCIES.PasswordHasher).toDynamicValue(
        () => new BcryptPasswordHasher(Number(process.env.BCRYPT_ROUNDS) || 12),
    );
    GLOBAL_CONTAINER.bind<TokenService>(TYPESDEPENDENCIES.TokenService).to(JwtTokenService).inSingletonScope();
    GLOBAL_CONTAINER.bind<PubSub>(TYPESDEPENDENCIES.PubSub).toConstantValue(pubsubV2);
    GLOBAL_CONTAINER.bind<AuthRouter>(TYPESDEPENDENCIES.AuthRouter).to(AuthRouter).inSingletonScope();
};

export default createDependencies;
