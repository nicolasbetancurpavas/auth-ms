import 'reflect-metadata';
import { AuthErrorCode } from '@common/http/exceptions';
import UserDAO from '@infrastructure/bd/postgresql/dao/authDAO';
import { toCreateUserParams, toUserAuth, toUserVM } from '@infrastructure/bd/postgresql/models/UserRow';
import { CREATE_USER, VALIDATE_EMAIL } from '@infrastructure/bd/postgresql/dao/querys/queryAuth';

// 🔧 Stub de transformadores (no dependemos de su implementación real)
jest.mock('@infrastructure/bd/postgresql/models/UserRow', () => ({
    toCreateUserParams: jest.fn(),
    toUserAuth: jest.fn(),
    toUserVM: jest.fn(),
}));

// 🔧 Stub de queries, para poder asertar que se llaman EXACTAMENTE con estos SQL
jest.mock('@infrastructure/bd/postgresql/dao/querys/queryAuth', () => ({
    VALIDATE_EMAIL: 'SELECT id, nombre, email, rol, password_hash FROM usuarios WHERE email = $1',
    CREATE_USER:
        'INSERT INTO usuarios (nombre, email, rol, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol, password_hash',
}));

describe('UserDAO', () => {
    const db = {
        oneOrNone: jest.fn(),
        one: jest.fn(),
    } as any;

    const dao = new UserDAO(db);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findByEmail', () => {
        it('consulta por email y mapea con toUserAuth', async () => {
            const row = { id: 'u1', nombre: 'Nico', email: 'user@test.com', rol: 'user', password_hash: 'hash' };
            const mapped = { id: 'u1', name: 'Nico', email: 'user@test.com', rol: 'user', passwordHash: 'hash' };

            (db.oneOrNone as jest.Mock).mockResolvedValue(row);
            (toUserAuth as jest.Mock).mockReturnValue(mapped);

            const out = await dao.findByEmail('user@test.com');

            expect(db.oneOrNone).toHaveBeenCalledWith(VALIDATE_EMAIL, ['user@test.com']);
            expect(toUserAuth).toHaveBeenCalledWith(row);
            expect(out).toBe(mapped);
        });

        it('retorna null si no hay fila', async () => {
            (db.oneOrNone as jest.Mock).mockResolvedValue(null);

            const out = await dao.findByEmail('missing@test.com');

            expect(db.oneOrNone).toHaveBeenCalledWith(VALIDATE_EMAIL, ['missing@test.com']);
            expect(toUserAuth).not.toHaveBeenCalled();
            expect(out).toBeNull();
        });
    });

    describe('create', () => {
        it('inserta con CREATE_USER + toCreateUserParams y mapea con toUserVM', async () => {
            const input = { name: 'Nico', email: 'user@test.com', passwordHash: 'HASH', rol: 'user' };
            const params = ['Nico', 'user@test.com', 'user', 'HASH'];
            const row = { id: 'u1', nombre: 'Nico', email: 'user@test.com', rol: 'user', password_hash: 'HASH' };
            const vm = {
                id: 'u1',
                name: 'Nico',
                email: 'user@test.com',
                rol: 'user',
                createdAt: '2025-01-01T00:00:00.000Z',
            };

            (toCreateUserParams as jest.Mock).mockReturnValue(params);
            (db.one as jest.Mock).mockResolvedValue(row);
            (toUserVM as jest.Mock).mockReturnValue(vm);

            const out = await dao.create(input as any);

            expect(toCreateUserParams).toHaveBeenCalledWith(input);
            expect(db.one).toHaveBeenCalledWith(CREATE_USER, params);
            expect(toUserVM).toHaveBeenCalledWith(row);
            expect(out).toBe(vm);
        });

        it('traduce unique_violation (23505) a AuthException(EMAIL_ALREADY_EXISTS)', async () => {
            const input = { name: 'Nico', email: 'user@test.com', passwordHash: 'HASH', rol: 'user' };
            (toCreateUserParams as jest.Mock).mockReturnValue(['Nico', 'user@test.com', 'user', 'HASH']);
            (db.one as jest.Mock).mockRejectedValue({ code: '23505' });

            await expect(dao.create(input as any)).rejects.toEqual(
                expect.objectContaining({ code: AuthErrorCode.EMAIL_ALREADY_EXISTS }),
            );
        });
    });
});
