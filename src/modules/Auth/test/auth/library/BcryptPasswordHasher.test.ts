import 'reflect-metadata';
import bcrypt from 'bcrypt';
// usa alias si los tienes configurados en jest.config.js
import BcryptPasswordHasher from '@infrastructure/security/adapters/BcryptPasswordHasher';

describe('BcryptPasswordHasher', () => {
    it('hash & compare (real bcrypt) funcionan', async () => {
        // rounds bajos para que sea rápido en CI
        const hasher = new BcryptPasswordHasher(4);
        const plain = 'Abc#123456';

        const hash = await hasher.hash(plain);
        expect(typeof hash).toBe('string');
        expect(hash).not.toBe(plain);

        expect(await hasher.compare(plain, hash)).toBe(true);
        expect(await hasher.compare('incorrecta', hash)).toBe(false);
    });

    it('pasa los rounds correctamente a bcrypt.hash', async () => {
        const spy = jest.spyOn(bcrypt, 'hash');
        const hasher = new BcryptPasswordHasher(7);

        await hasher.hash('x');

        expect(spy).toHaveBeenCalledWith('x', 7);
        spy.mockRestore();
    });
});
