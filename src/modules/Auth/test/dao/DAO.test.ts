// import 'reflect-metadata';
// import { LNErrorDictionary, LNException } from '@common/http/exceptions';
// import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
// import TYPESDEPENDENCIES from '@modules/Tenecias/dependencies/TypesDependencies';
// import { IDataIn } from '@modules/Tenecias/domain/entities/DataInterface';
// import { ITenancyTypeChp, ITenancyTypes } from '@modules/Tenecias/domain/models/RequestTenancyData';
// import TenancyDAO from '@infrastructure/bd/postgresql/dao/TenencyDAO';

// jest.mock('@common/dependencies/DependencyContainer', () => ({
//     GLOBAL_CONTAINER: {
//         get: jest.fn(),
//     },
// }));

// describe('TenancyDAO', () => {
//     let dao: TenancyDAO;
//     const dbMock = {
//         oneOrNone: jest.fn(),
//         manyOrNone: jest.fn(),
//     };

//     beforeEach(() => {
//         (GLOBAL_CONTAINER.get as jest.Mock).mockImplementation((dep) => {
//             if (dep === TYPESDEPENDENCIES.Postgresql) return dbMock;
//             return null;
//         });
//         dao = new TenancyDAO();
//     });

//     describe('TenancyByUnitDAO', () => {
//         const input: IDataIn = {
//             etiqueta1d: 222222,
//             id_checkpoint: 456,
//         };

//         it('debe retornar la tenencia si existe', async () => {
//             dbMock.oneOrNone.mockResolvedValueOnce({
//                 id_checkpoint: 456,
//                 guia: 'G123',
//                 etiqueta1d: 'ETQ123',
//                 recurso_tenencia: '999',
//                 id_tipo_tenencia_actual: 1,
//                 nombre_tenencia_actual: 'Almacén',
//                 id_tipo_tenencia: 2,
//                 nombre_tenencia_padre: 'Plataforma',
//             });

//             const result = await dao.TenancyByUnitDAO(input);

//             expect(result).toEqual({
//                 id_checkpoint: 456,
//                 guia: 'G123',
//                 etiqueta1d: 'ETQ123',
//                 recurso_tenencia_actual: '999',
//                 id_tipo_tenencia_actual: 1,
//                 nombre_tenencia_actual: 'Almacén',
//                 tipos_tenencia_asociados: [
//                     {
//                         id_checkpoint: 456,
//                         id_tipo_tenencia: 2,
//                         nombre_tenencia: 'Plataforma',
//                     },
//                 ],
//             });
//         });

//         it('debe lanzar LNException si no encuentra resultado', async () => {
//             dbMock.oneOrNone.mockResolvedValueOnce(null);

//             try {
//                 await dao.TenancyByUnitDAO(input);
//                 fail('Debió lanzar LNException');
//             } catch (error: any) {
//                 expect(error).toBeInstanceOf(LNException);
//                 expect(error.message).toContain(
//                     `No se encontró la etiqueta1d '${input.etiqueta1d}' asociada al checkpoint ID ${input.id_checkpoint}.`,
//                 );
//                 expect(error.internalCode).toBe(LNErrorDictionary.NOT_FOUND.codeLN);
//             }
//         });

//         it('debe lanzar error genérico si ocurre un error inesperado', async () => {
//             dbMock.oneOrNone.mockRejectedValueOnce(new Error('DB error'));
//             await expect(dao.TenancyByUnitDAO(input)).rejects.toThrow('Error consultando la tenencia de la unidad');
//         });
//     });

//     describe('TenancyTypesDAO', () => {
//         it('debe retornar lista de tipos de tenencia', async () => {
//             const expected: ITenancyTypes[] = [
//                 { id_tipo_tenencia: 1, nombre_tenencia: 'Plataforma', activo: true },
//                 { id_tipo_tenencia: 2, nombre_tenencia: 'Almacén', activo: true },
//             ];
//             dbMock.manyOrNone.mockResolvedValueOnce(expected);

//             const result = await dao.TenancyTypesDAO();
//             expect(result).toEqual(expected);
//         });

//         it('debe lanzar error si falla la consulta', async () => {
//             dbMock.manyOrNone.mockRejectedValueOnce(new Error('query fail'));
//             await expect(dao.TenancyTypesDAO()).rejects.toThrow('Error consultando maestro de tenencias');
//         });
//     });

//     describe('TenancyCheckpointsDAO', () => {
//         it('debe retornar lista de tenencias por checkpoint', async () => {
//             const expected: ITenancyTypeChp[] = [
//                 { id_tipo_tenencia: 1, nombre_tenencia: 'Plataforma', id_checkpoint: 1, nombre_checkpoint: 'Ingreso' },
//                 { id_tipo_tenencia: 2, nombre_tenencia: 'Almacén', id_checkpoint: 2, nombre_checkpoint: 'Salida' },
//             ];
//             dbMock.manyOrNone.mockResolvedValueOnce(expected);

//             const result = await dao.TenancyCheckpointsDAO();
//             expect(result).toEqual(expected);
//         });

//         it('debe lanzar error si falla la consulta', async () => {
//             dbMock.manyOrNone.mockRejectedValueOnce(new Error('query fail'));
//             await expect(dao.TenancyCheckpointsDAO()).rejects.toThrow('Error consultando maestro de tenencias');
//         });
//     });
// });
