import 'reflect-metadata';
import { AuthException, AuthErrorCode } from '@common/http/exceptions';
import LoginUserUseCase from '@modules/Auth/usecase/LoginUserUseCase';

// Mocks tipados
type MockedRepo = { findByEmail: jest.Mock };
type MockedHasher = { compare: jest.Mock };
type MockedTokens = { sign: jest.Mock };

function makeDeps() {
    const userRepo: MockedRepo = { findByEmail: jest.fn() };
    const hasher: MockedHasher = { compare: jest.fn() };
    const tokens: MockedTokens = { sign: jest.fn() };
    const sut = new LoginUserUseCase(userRepo as any, hasher as any, tokens as any);
    return { sut, userRepo, hasher, tokens };
}

const sampleUser = {
    id: 'u_1',
    name: 'Nico',
    email: 'user@test.com',
    rol: 'user',
    passwordHash: '$2b$10$hash',
    createdAt: new Date().toISOString(),
};

describe('LoginUserUseCase', () => {
    it('normaliza email (trim + lowercase) antes de consultar', async () => {
        const { sut, userRepo, hasher, tokens } = makeDeps();
        userRepo.findByEmail.mockResolvedValue(null);

        await expect(sut.execute({ email: '  UsEr@TeSt.Com  ', password: 'x' } as any)).rejects.toBeInstanceOf(
            AuthException,
        );

        expect(userRepo.findByEmail).toHaveBeenCalledWith('user@test.com');
        expect(hasher.compare).not.toHaveBeenCalled();
        expect(tokens.sign).not.toHaveBeenCalled();
    });

    it('lanza INVALID_CREDENTIALS si no existe el usuario', async () => {
        const { sut, userRepo } = makeDeps();
        userRepo.findByEmail.mockResolvedValue(null);

        await expect(sut.execute({ email: 'user@test.com', password: 'x' } as any)).rejects.toEqual(
            expect.objectContaining({
                // según tu implementación puede ser `code` o `errorCode`
                code: AuthErrorCode.INVALID_CREDENTIALS,
            }),
        );
    });

    it('lanza INVALID_CREDENTIALS si la contraseña no coincide', async () => {
        const { sut, userRepo, hasher, tokens } = makeDeps();
        userRepo.findByEmail.mockResolvedValue(sampleUser);
        hasher.compare.mockResolvedValue(false);

        await expect(sut.execute({ email: 'user@test.com', password: 'wrong' } as any)).rejects.toEqual(
            expect.objectContaining({ code: AuthErrorCode.INVALID_CREDENTIALS }),
        );

        expect(tokens.sign).not.toHaveBeenCalled();
    });

    it('devuelve accessToken y user sin passwordHash cuando las credenciales son válidas', async () => {
        const { sut, userRepo, hasher, tokens } = makeDeps();
        userRepo.findByEmail.mockResolvedValue(sampleUser);
        hasher.compare.mockResolvedValue(true);
        tokens.sign.mockReturnValue('jwt_123');

        const out = await sut.execute({ email: 'USER@test.com', password: 'Abcd1234!' } as any);

        expect(out.accessToken).toBe('jwt_123');
        expect(out.user).toMatchObject({
            id: 'u_1',
            email: 'user@test.com',
            rol: 'user',
            name: 'Nico',
        });
        // asegura que no sale el hash
        expect('passwordHash' in out.user).toBe(false);

        // payload correcto
        expect(tokens.sign).toHaveBeenCalledWith({
            sub: sampleUser.id,
            email: sampleUser.email,
            rol: sampleUser.rol,
        });

        // compara con params correctos
        expect(hasher.compare).toHaveBeenCalledWith('Abcd1234!', sampleUser.passwordHash);
    });
});
