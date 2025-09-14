import { IModule } from '@common/modules/IModule';
import { HTTPMETODO, Ruta } from '@common/modules/Ruta';
import createDependencies from './dependencies/Dependencies';
import createDependencyContainer from '@common/dependencies/DependencyContainer';
import TenancyRouter from './controllers/AuthRouter';

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
                evento: TenancyRouter.prototype.register,
            },
            {
                metodo: HTTPMETODO.POST,
                url: '/login',
                evento: TenancyRouter.prototype.login,
            },
            {
                metodo: HTTPMETODO.GET,
                url: '/validate',
                evento: TenancyRouter.prototype.validate,
            },
        ];
    };

    get ruta(): string {
        return this.moduloRuta;
    }
}
