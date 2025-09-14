// import TenancyRouter from '../controllers/TenancyRouter';
// import { HTTPMETODO } from '@common/modules/Ruta';
// import Modules from '../TenancyModules';

// describe('Modules', () => {
//     let modules: Modules;

//     beforeEach(() => {
//         modules = new Modules();
//     });

//     it('debe tener la ruta base "/api/v1/"', () => {
//         expect(modules.ruta).toBe('/api/v1/');
//     });

//     it('debe retornar las rutas configuradas correctamente', () => {
//         const rutas = modules.getRutas();

//         expect(rutas).toHaveLength(3);

//         expect(rutas[0]).toEqual({
//             metodo: HTTPMETODO.GET,
//             url: '/etiqueta1d/tenencia',
//             evento: TenancyRouter.prototype.getTenancyByUnit,
//         });

//         expect(rutas[1]).toEqual({
//             metodo: HTTPMETODO.GET,
//             url: '/tipos/tenencias',
//             evento: TenancyRouter.prototype.getTenancyTypes,
//         });
//         expect(rutas[2]).toEqual({
//             metodo: HTTPMETODO.GET,
//             url: '/tenencias/checkpoints',
//             evento: TenancyRouter.prototype.getTenancyChps,
//         });
//     });
// });
