import 'reflect-metadata';
import JwtTokenService from '@infrastructure/security/adapters/JwtTokenService';

// Mock del ENV para no depender de .env real
jest.mock('@modules/shared', () => ({
    ENV: {
        JWT_SECRET: 'unit-secret',
        ACCESS_TOKEN_TTL: '1h', // valor por defecto
    },
}));

// 👇 Usa el path real de tu archivo. Si tu fichero es "JwtTokenService.ts.ts", deja esa ruta.
// Si es "JwtTokenService.ts", cambia el import.

describe('JwtTokenService', () => {
    it('sign + verify devuelve el payload', () => {
        const svc = new JwtTokenService();
        const payload = { sub: 'u1', email: 'user@test.com', rol: 'user' };

        const token = svc.sign(payload);
        expect(typeof token).toBe('string');

        const decoded = svc.verify<any>(token);
        expect(decoded).toMatchObject(payload);
        // viene con iat/exp
        expect(typeof decoded.iat).toBe('number');
        expect(typeof decoded.exp).toBe('number');
    });

    it('usa ACCESS_TOKEN_TTL del ENV cuando no se pasa expiresIn', () => {
        const svc = new JwtTokenService();
        const token = svc.sign({ foo: 'bar' });
        const decoded = svc.verify<any>(token);

        const lifetime = decoded.exp - decoded.iat; // en segundos
        // 1h = 3600s (tolerancia +/-5s por tiempo de ejecución)
        expect(lifetime).toBeGreaterThanOrEqual(3595);
        expect(lifetime).toBeLessThanOrEqual(3605);
    });

    it('permite sobreescribir expiresIn vía options', () => {
        const svc = new JwtTokenService();
        const token = svc.sign({ foo: 'bar' }, { expiresIn: '2h' });
        const decoded = svc.verify<any>(token);
        const lifetime = decoded.exp - decoded.iat;

        // 2h = 7200s (tolerancia)
        expect(lifetime).toBeGreaterThanOrEqual(7195);
        expect(lifetime).toBeLessThanOrEqual(7205);
    });
});
