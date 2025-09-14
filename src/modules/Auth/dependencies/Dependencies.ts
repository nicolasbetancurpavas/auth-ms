import TYPESDEPENDENCIES from './TypesDependencies';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { IDatabase, IMain } from 'pg-promise';
import { db } from '@infrastructure/bd';
import { pubsubV2 } from '@infrastructure/pubsub';
import { PubSub } from '@google-cloud/pubsub';
// import { TenancyRepository } from '../domain/repositories/TenancyRepository';
// import TenancyDAO from '@infrastructure/bd/postgresql/dao/TenencyDAO';
import LoginUserUseCase from '../usecase/LoginUserUseCase';
import AuthRouter from '../controllers/AuthRouter';

const createDependencies = (): void => {
    GLOBAL_CONTAINER.bind<IDatabase<IMain>>(TYPESDEPENDENCIES.Postgresql).toConstantValue(db);
    GLOBAL_CONTAINER.bind<LoginUserUseCase>(TYPESDEPENDENCIES.LoginUserUseCase).to(LoginUserUseCase).inSingletonScope();
    // GLOBAL_CONTAINER.bind<TenancyRepository>(TYPESDEPENDENCIES.TenancyRepository).to(TenancyDAO).inSingletonScope();
    GLOBAL_CONTAINER.bind<PubSub>(TYPESDEPENDENCIES.PubSub).toConstantValue(pubsubV2);
    GLOBAL_CONTAINER.bind<AuthRouter>(TYPESDEPENDENCIES.TenancyRouter).to(AuthRouter).inSingletonScope();
};

export default createDependencies;
