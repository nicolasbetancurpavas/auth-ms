// import TenancyRouter from '@modules/Tenecias/controllers/TenancyRouter';
// import { validateData } from '@modules/shared/config/schemas/SchemaValidator';
// import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
// import Result from '@common/http/Result';
// import TenancyUseCase from '@modules/Tenecias/usecase/TenenciasUseCase';
// import { Request } from '@common/http/Request';

// jest.mock('@modules/shared/config/schemas/SchemaValidator', () => ({
//     validateData: jest.fn(),
// }));

// jest.mock('@common/dependencies/DependencyContainer', () => ({
//     GLOBAL_CONTAINER: {
//         get: jest.fn(),
//     },
// }));

// jest.mock('@common/http/Result', () => ({
//     ok: jest.fn((data) => ({
//         status: 200,
//         response: data,
//     })),
// }));

// describe('TenancyRouter', () => {
//     let router: TenancyRouter;
//     let useCaseMock: Partial<TenancyUseCase>;

//     const mockRequest: Request<any> = {
//         data: { id_checkpoint: 123, etiqueta1d: 'ETQ123' },
//     } as Request<any>;

//     const mockRequestTenenciasChp: Request<any> = {
//         data: { id_checkpoint: 123 },
//     } as Request<any>;

//     beforeEach(() => {
//         router = new TenancyRouter();

//         useCaseMock = {
//             executeTenancyByUnit: jest.fn().mockResolvedValue({
//                 guia: 'GUIA1',
//                 etiqueta1d: 'ETQ123',
//             }),
//             executeTenancyTypes: jest
//                 .fn()
//                 .mockResolvedValue([{ id_tipo_tenencia: 1, nombre_tenencia: 'Almacén', activo: true }]),
//             executeTenancyChp: jest.fn(),
//         };

//         (validateData as jest.Mock).mockReturnValue(mockRequest.data);
//         (GLOBAL_CONTAINER.get as jest.Mock).mockReturnValue(useCaseMock);
//     });

//     it('debe retornar la tenencia por unidad correctamente', async () => {
//         const result = await router.getTenancyByUnit(mockRequest);

//         expect(validateData).toHaveBeenCalledWith(expect.anything(), mockRequest.data);
//         expect(useCaseMock.executeTenancyByUnit).toHaveBeenCalledWith(mockRequest.data);
//         expect(Result.ok).toHaveBeenCalledWith({
//             message: {
//                 guia: 'GUIA1',
//                 etiqueta1d: 'ETQ123',
//             },
//         });
//         expect(result.status).toBe(200);
//     });
//     it('debe retornar todas las tenencias de checkpoints correctamente', async () => {
//         (useCaseMock.executeTenancyChp as jest.Mock).mockResolvedValue([
//             {
//                 id_tipo_tenencia: 1,
//                 nombre_tenencia: 'Plataforma',
//                 id_checkpoint: 123,
//                 nombre_checkpoint: 'Checkpoint A',
//             },
//         ]);

//         const result = await router.getTenancyChps(mockRequestTenenciasChp);

//         expect(useCaseMock.executeTenancyChp).toHaveBeenCalled(); // ✅
//         expect(Result.ok).toHaveBeenCalledWith({
//             message: [
//                 {
//                     id_tipo_tenencia: 1,
//                     nombre_tenencia: 'Plataforma',
//                     id_checkpoint: 123,
//                     nombre_checkpoint: 'Checkpoint A',
//                 },
//             ],
//         });
//         expect(result.status).toBe(200);
//     });

//     it('debe lanzar error si executeTenancyByUnit falla', async () => {
//         (useCaseMock.executeTenancyByUnit as jest.Mock).mockRejectedValueOnce(new Error('Falla lógica'));

//         await expect(router.getTenancyByUnit(mockRequest)).rejects.toThrow('Falla lógica');
//     });
//     it('debe retornar todos los tipos de tenencias correctamente', async () => {
//         (useCaseMock.executeTenancyTypes as jest.Mock).mockResolvedValue([
//             {
//                 id_tipo_tenencia: 1,
//                 nombre_tenencia: 'Almacén',
//                 activo: true,
//             },
//         ]);

//         const result = await router.getTenancyTypes();

//         expect(useCaseMock.executeTenancyTypes).toHaveBeenCalled();
//         expect(Result.ok).toHaveBeenCalledWith({
//             message: [
//                 {
//                     id_tipo_tenencia: 1,
//                     nombre_tenencia: 'Almacén',
//                     activo: true,
//                 },
//             ],
//         });
//         expect(result.status).toBe(200);
//     });
// });
