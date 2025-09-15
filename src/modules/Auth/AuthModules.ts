import { IModule } from '@common/modules/IModule';
import { HTTPMETODO, Ruta } from '@common/modules/Ruta';
import createDependencies from './dependencies/Dependencies';
import createDependencyContainer from '@common/dependencies/DependencyContainer';
import AuthRouter from './controllers/AuthRouter';

export default class Modules implements IModule {
    private moduloRuta = '/api/v1/';

    constructor() {
        createDependencyContainer();
        createDependencies();
    }

    getRutas = (): Ruta[] => {
        return [
            {
                metodo: HTTPMETODO.POST,
                url: '/register',
                evento: AuthRouter.prototype.register,
            },
            {
                metodo: HTTPMETODO.POST,
                url: '/login',
                evento: AuthRouter.prototype.login,
            },
            {
                metodo: HTTPMETODO.GET,
                url: '/validate',
                evento: AuthRouter.prototype.validate,
            },
        ];
    };

    get ruta(): string {
        return this.moduloRuta;
    }
}
