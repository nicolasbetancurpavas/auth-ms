import { toUserVM, toUserAuth, toCreateUserParams, UserRow } from '@infrastructure/bd/postgresql/models/UserRow';

describe('UserRow mappers', () => {
    const row: UserRow = {
        id: 10,
        nombre: 'Nico',
        email: 'user@test.com',
        rol: 'user',
        password_hash: 'HASHED',
    };

    it('toUserVM', () => {
        expect(toUserVM(row)).toEqual({
            id: 10,
            name: 'Nico',
            email: 'user@test.com',
            rol: 'user',
        });
    });

    it('toUserAuth (incluye passwordHash)', () => {
        expect(toUserAuth(row)).toEqual({
            id: 10,
            name: 'Nico',
            email: 'user@test.com',
            rol: 'user',
            passwordHash: 'HASHED',
        });
    });

    it('toCreateUserParams (orden correcto)', () => {
        const input = {
            name: 'Nico',
            email: 'user@test.com',
            rol: 'admin' as const,
            passwordHash: 'HASHED',
        };
        expect(toCreateUserParams(input)).toEqual(['Nico', 'user@test.com', 'admin', 'HASHED']);
    });
});
