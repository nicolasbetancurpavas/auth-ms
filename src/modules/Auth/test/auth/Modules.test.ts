// test/Modules.test.ts
import { HTTPMETODO } from '@common/modules/Ruta';
import Modules from '@modules/Auth/AuthModules';
import AuthRouter from '@modules/Auth/controllers/AuthRouter';

// mockeamos los “setup” para evitar efectos colaterales
jest.mock('@modules/Auth/dependencies/Dependencies', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock('@common/dependencies/DependencyContainer', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('Auth Modules', () => {
    it('expone el prefijo correcto', () => {
        const mod = new Modules();
        expect(mod.ruta).toBe('/api/v1/');
    });

    it('retorna las rutas esperadas con sus handlers', () => {
        const mod = new Modules();
        const rutas = mod.getRutas();

        expect(Array.isArray(rutas)).toBe(true);
        expect(rutas).toHaveLength(3);

        // /register
        const register = rutas.find((r: { url: string }) => r.url === '/register');
        expect(register?.metodo).toBe(HTTPMETODO.POST);
        expect(register?.evento).toBe(AuthRouter.prototype.register);

        // /login
        const login = rutas.find((r: { url: string }) => r.url === '/login');
        expect(login?.metodo).toBe(HTTPMETODO.POST);
        expect(login?.evento).toBe(AuthRouter.prototype.login);

        // /validate
        const validate = rutas.find((r: { url: string }) => r.url === '/validate');
        expect(validate?.metodo).toBe(HTTPMETODO.GET);
        expect(validate?.evento).toBe(AuthRouter.prototype.validate);
    });
});
