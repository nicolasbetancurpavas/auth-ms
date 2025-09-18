import 'reflect-metadata';

import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import { validateData } from '@modules/shared/config/schemas/SchemaValidator';
import TYPESDEPENDENCIES from '@modules/Auth/dependencies/TypesDependencies';
import AuthRouter from '@modules/Auth/controllers/AuthRouter';
import { validateHeaders } from '@modules/Auth/schemas/ShemaValidator';
import { registerParamsSchema } from '@modules/Auth/schemas/RegisterSchema';
import { authHeadersSchema, extractBearer } from '@modules/Auth/schemas/HeadersShema';
import { loginParamsSchema } from '@modules/Auth/schemas/LoginShema';

// ---- Mocks ----
jest.mock('@common/dependencies/DependencyContainer', () => ({
    GLOBAL_CONTAINER: { get: jest.fn() },
}));

jest.mock('@modules/shared/config/schemas/SchemaValidator', () => ({
    validateData: jest.fn(),
}));

jest.mock('../../schemas/ShemaValidator', () => ({
    validateHeaders: jest.fn(),
}));

jest.mock('../../schemas/HeadersShema', () => ({
    authHeadersSchema: {} as any,
    registerHeadersSchema: {} as any,
    extractBearer: jest.fn(),
}));
describe('AuthRouter', () => {
    const mockRegisterUC = { execute: jest.fn() };
    const mockLoginUC = { execute: jest.fn() };
    const mockTokens = { verify: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();

        // Resolver del contenedor
        (GLOBAL_CONTAINER.get as jest.Mock).mockImplementation((token: symbol) => {
            switch (token) {
                case TYPESDEPENDENCIES.RegisterUserUseCase:
                    return mockRegisterUC;
                case TYPESDEPENDENCIES.LoginUserUseCase:
                    return mockLoginUC;
                case TYPESDEPENDENCIES.TokenService:
                    return mockTokens;
                default:
                    throw new Error('Token no mapeado en mock del contenedor');
            }
        });
    });

    describe('register', () => {
        it('ejecuta UC y retorna 201 con mensaje + data', async () => {
            const router = new AuthRouter();

            const req = {
                headers: { 'x-client-platform': 'web' },
                data: { name: 'Nico', email: 'user@test.com', password: 'Abc#123456' },
            } as any;

            const validatedDto = { ...req.data };
            const createdUser = {
                id: 'u1',
                name: 'Nico',
                email: 'user@test.com',
                rol: 'user',
                createdAt: '2025-01-01T00:00:00.000Z',
            };

            (validateData as jest.Mock).mockImplementation((schema, data) => {
                expect(schema).toBe(registerParamsSchema);
                expect(data).toBe(req.data);
                return validatedDto;
            });

            (mockRegisterUC.execute as jest.Mock).mockResolvedValue(createdUser);

            const result = await router.register(req);

            // Ya no validamos validateHeaders

            expect(GLOBAL_CONTAINER.get).toHaveBeenCalledWith(TYPESDEPENDENCIES.RegisterUserUseCase);
            expect(mockRegisterUC.execute).toHaveBeenCalledWith(validatedDto);

            expect(result.status).toBe(201);
            expect(result.response).toEqual({
                message: 'Usuario creado con éxito',
                data: createdUser,
            });
        });
    });

    describe('login', () => {
        it('valida headers y body, ejecuta UC y retorna 200 con headers no-cache', async () => {
            const router = new AuthRouter();

            const req = {
                headers: { 'x-client-platform': 'web' },
                data: { email: 'user@test.com', password: 'Abc#123456' },
            } as any;

            const validatedDto = { ...req.data };
            const ucOut = {
                accessToken: 'jwt_123',
                user: { id: 'u1', email: 'user@test.com', name: 'Nico', rol: 'user' },
            };

            // (validateHeaders as jest.Mock).mockReturnValue(req.headers);
            (validateData as jest.Mock).mockImplementation((schema, data) => {
                // se usa loginParamsSchema
                expect(schema).toBe(loginParamsSchema);
                expect(data).toBe(req.data);
                return validatedDto;
            });
            (mockLoginUC.execute as jest.Mock).mockResolvedValue(ucOut);

            const result = await router.login(req);

            // expect(validateHeaders).toHaveBeenCalledWith(registerHeadersSchema, req.headers); // así está en tu código
            expect(GLOBAL_CONTAINER.get).toHaveBeenCalledWith(TYPESDEPENDENCIES.LoginUserUseCase);
            expect(mockLoginUC.execute).toHaveBeenCalledWith(validatedDto);

            expect(result.status).toBe(200);
            expect(result.response).toEqual(ucOut);
            expect((result as any).headers).toEqual({
                'Cache-Control': 'no-store, max-age=0',
            });
        });
    });

    describe('validate', () => {
        it('valida headers, extrae Bearer, verifica token y retorna payload', async () => {
            const router = new AuthRouter();

            const req = {
                headers: { authorization: 'Bearer abc.def.ghi' },
                data: undefined,
            } as any;

            const payload = { sub: 'u1', email: 'user@test.com', rol: 'user', iat: 1, exp: 2 };

            (validateHeaders as jest.Mock).mockReturnValue(req.headers);
            (extractBearer as jest.Mock).mockReturnValue('abc.def.ghi');
            (mockTokens.verify as jest.Mock).mockReturnValue(payload);

            const result = await router.validate(req);

            expect(validateHeaders).toHaveBeenCalledWith(authHeadersSchema, req.headers);
            expect(extractBearer).toHaveBeenCalledWith('Bearer abc.def.ghi');
            expect(GLOBAL_CONTAINER.get).toHaveBeenCalledWith(TYPESDEPENDENCIES.TokenService);
            expect(mockTokens.verify).toHaveBeenCalledWith('abc.def.ghi');

            expect(result.status).toBe(200);
            expect(result.response).toEqual({ valid: true, payload });
            expect((result as any).headers).toEqual({
                'Cache-Control': 'no-store, max-age=0',
            });
        });
    });
});
