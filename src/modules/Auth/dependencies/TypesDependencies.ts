import TYPES from '@common/dependencies/Types';

const TYPESDEPENDENCIES = {
    ...TYPES,
    Postgresql: Symbol.for('Postgresql'),
    LoginUserUseCase: Symbol.for('LoginUserUseCase'),
    RegisterUserUseCase: Symbol.for('RegisterUserUseCase'),
    DomainService: Symbol.for('DomainService'),
    UserRepository: Symbol.for('UserRepository'),
    PasswordHasher: Symbol.for('PasswordHasher'),
    TokenService: Symbol.for('TokenService'),
    AuthRouter: Symbol.for('AuthRouter'),
};

export default TYPESDEPENDENCIES;
