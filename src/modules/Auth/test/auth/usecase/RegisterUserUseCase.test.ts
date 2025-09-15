import 'reflect-metadata';
import { AuthErrorCode } from '@common/http/exceptions';
import RegisterUserUseCase from '@modules/Auth/usecase/RegisterUserUseCase';

// Mocks simples
type MockRepo = { findByEmail: jest.Mock; create: jest.Mock };
type MockHasher = { hash: jest.Mock };

function makeDeps() {
    const userRepo: MockRepo = {
        findByEmail: jest.fn(),
        create: jest.fn(),
    };
    const hasher: MockHasher = {
        hash: jest.fn(),
    };
    const sut = new RegisterUserUseCase(userRepo as any, hasher as any);
    return { sut, userRepo, hasher };
}

const userVM = {
    id: 'u_1',
    name: 'Nico',
    email: 'user@test.com',
    rol: 'user',
    createdAt: new Date().toISOString(),
};

describe('RegisterUserUseCase', () => {
    beforeEach(() => jest.clearAllMocks());

    it('lanza EMAIL_ALREADY_EXISTS si el email ya existe', async () => {
        const { sut, userRepo } = makeDeps();
        userRepo.findByEmail.mockResolvedValue({ id: 'exists' });

        await expect(sut.execute({ name: 'X', email: 'user@test.com', password: 'P@ssw0rd' } as any)).rejects.toEqual(
            expect.objectContaining({ code: AuthErrorCode.EMAIL_ALREADY_EXISTS }),
        );

        expect(userRepo.findByEmail).toHaveBeenCalledWith('user@test.com');
        expect(userRepo.create).not.toHaveBeenCalled();
    });

    it('normaliza email (trim+lower) y name (trim), usa rol por defecto "user", hace hash y crea', async () => {
        const { sut, userRepo, hasher } = makeDeps();
        userRepo.findByEmail.mockResolvedValue(null);
        hasher.hash.mockResolvedValue('HASHED');
        userRepo.create.mockResolvedValue(userVM);

        const out = await sut.execute({
            name: '  Nico  ',
            email: '  USER@test.COM  ',
            password: 'P@ssw0rd!',
        } as any);

        expect(userRepo.findByEmail).toHaveBeenCalledWith('user@test.com');
        expect(hasher.hash).toHaveBeenCalledWith('P@ssw0rd!');
        expect(userRepo.create).toHaveBeenCalledWith({
            name: 'Nico',
            email: 'user@test.com',
            passwordHash: 'HASHED',
            rol: 'user',
        });

        expect(out).toEqual(userVM);
        // no debería exponerse el hash en el VM

        expect(out).not.toHaveProperty('passwordHash');
    });

    it('respeta rol explícito cuando viene en el input', async () => {
        const { sut, userRepo, hasher } = makeDeps();
        userRepo.findByEmail.mockResolvedValue(null);
        hasher.hash.mockResolvedValue('HASHED');
        userRepo.create.mockResolvedValue({ ...userVM, rol: 'admin', email: 'admin@test.com' });

        const out = await sut.execute({
            name: ' Admin ',
            email: ' Admin@test.com ',
            password: 'Secr3t!',
            rol: 'admin',
        } as any);

        expect(userRepo.create).toHaveBeenCalledWith({
            name: 'Admin',
            email: 'admin@test.com',
            passwordHash: 'HASHED',
            rol: 'admin',
        });
        expect(out.rol).toBe('admin');
    });
});
