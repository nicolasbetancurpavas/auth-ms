import TYPES from '@common/dependencies/Types';

const TYPESDEPENDENCIES = {
    ...TYPES,
    Firestore: Symbol.for('Firestore'),
    Postgresql: Symbol.for('Postgresql'),
    RedisAdapter: Symbol.for('RedisAdapter'),
    LoginUserUseCase: Symbol.for('LoginUserUseCase'),
    RegisterUserUseCase: Symbol.for('RegisterUserUseCase'),
    TenancyRouter: Symbol.for('TenancyRouter'),
    TenancyRepository: Symbol.for('TenancyRepository'),
    ProcesarCheckpointDomainService: Symbol.for('ProcesarCheckpointDomainService'),
    RedisRepo: Symbol.for('redisRepo'),
    FirestoreCheckpointRepository: Symbol.for('FirestoreCheckpointRepository'),
    DomainService: Symbol.for('DomainService'),
    UserRepository: Symbol.for('UserRepository'),
    PasswordHasher: Symbol.for('PasswordHasher'),
    TokenService: Symbol.for('TokenService'),
};

export default TYPESDEPENDENCIES;
