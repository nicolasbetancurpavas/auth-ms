// import 'reflect-metadata';
// import { IDataIn } from '../domain/entities/DataInterface';
// import TenancyDomainService from '../domain/services/AuthDomainServices';
// import { ITenancyTypes, ITenancyTypeChp } from '../domain/models/RequestTenancyData';

// const mockRedis = {
//     getRedisValue: jest.fn(),
//     setRedisValue: jest.fn(),
// };

// const mockRepository = {
//     TenancyByUnitDAO: jest.fn(),
//     TenancyTypesDAO: jest.fn(),
//     TenancyCheckpointsDAO: jest.fn(),
// };

// describe('TenancyDomainService (mocked)', () => {
//     let service: TenancyDomainService;

//     beforeEach(() => {
//         jest.clearAllMocks();
//         service = new TenancyDomainService(mockRedis as any, mockRepository as any);
//     });

//     describe('getTenancyByUnit', () => {
//         it('debe retornar la tenencia consultada por unidad', async () => {
//             const data: IDataIn = { etiqueta1d: 22222, id_checkpoint: 1 };
//             const responseMock = { unidad: 'xyz' };

//             mockRepository.TenancyByUnitDAO.mockResolvedValue(responseMock);

//             const result = await service.getTenancyByUnit(data);

//             expect(mockRepository.TenancyByUnitDAO).toHaveBeenCalledWith(data);
//             expect(result).toEqual(responseMock);
//         });
//     });

//     describe('getTenanciesChpWithFilter', () => {
//         const id_checkpoint = 5;
//         const redisKey = 'tenencias-checkpoint';

//         const mockTenancies: ITenancyTypeChp[] = [
//             { id_checkpoint: 5, id_tipo_tenencia: 1, nombre_tenencia: 'Plataforma', nombre_checkpoint: 'CP' },
//             { id_checkpoint: 5, id_tipo_tenencia: 2, nombre_tenencia: 'Almacén', nombre_checkpoint: 'CP' },
//         ];

//         it('debe retornar la data desde Redis si existe', async () => {
//             mockRedis.getRedisValue.mockResolvedValueOnce(mockTenancies);

//             const result = await service.getTenanciesChpWithFilter(id_checkpoint);

//             expect(mockRedis.getRedisValue).toHaveBeenCalledWith(redisKey);
//             expect(result.tenancyChp).toEqual(mockTenancies[0]);
//             expect(result.allTenancyChps).toEqual([
//                 {
//                     id_tipo_tenencia: 1,
//                     nombre_tenencia: 'Plataforma',
//                     nombre_checkpoint: 'CP',
//                 },
//                 {
//                     id_tipo_tenencia: 2,
//                     nombre_tenencia: 'Almacén',
//                     nombre_checkpoint: 'CP',
//                 },
//             ]);
//         });

//         it('debe consultar en BD si no hay en Redis y luego setear en Redis', async () => {
//             mockRedis.getRedisValue.mockResolvedValueOnce(null);
//             mockRepository.TenancyCheckpointsDAO.mockResolvedValueOnce(mockTenancies);

//             const result = await service.getTenanciesChpWithFilter(id_checkpoint);

//             expect(mockRepository.TenancyCheckpointsDAO).toHaveBeenCalled();
//             expect(mockRedis.setRedisValue).toHaveBeenCalledWith(redisKey, mockTenancies);
//             expect(result.tenancyChp).toEqual(mockTenancies[0]);
//         });
//     });

//     describe('tenancyTypesServices', () => {
//         const redisKey = 'tipos-tenencias';

//         const mockTypes: ITenancyTypes[] = [{ id_tipo_tenencia: 1, nombre_tenencia: 'Almacén', activo: true }];

//         it('debe retornar desde Redis si existe', async () => {
//             mockRedis.getRedisValue.mockResolvedValueOnce(mockTypes);

//             const result = await service.tenancyTypesServices();

//             expect(mockRedis.getRedisValue).toHaveBeenCalledWith(redisKey);
//             expect(result).toEqual(mockTypes);
//         });

//         it('debe consultar en BD si no hay en Redis y luego guardar en Redis', async () => {
//             mockRedis.getRedisValue.mockResolvedValueOnce(null);
//             mockRepository.TenancyTypesDAO.mockResolvedValueOnce(mockTypes);

//             const result = await service.tenancyTypesServices();

//             expect(mockRepository.TenancyTypesDAO).toHaveBeenCalled();
//             expect(mockRedis.setRedisValue).toHaveBeenCalledWith(redisKey, mockTypes);
//             expect(result).toEqual(mockTypes);
//         });
//     });

//     describe('tenancyChpsServices', () => {
//         const redisKey = 'tenencias-checkpoint';

//         const mockChps: ITenancyTypeChp[] = [
//             { id_tipo_tenencia: 1, nombre_tenencia: 'Almacén', id_checkpoint: 1, nombre_checkpoint: 'CP A' },
//         ];

//         it('debe retornar desde Redis si existe', async () => {
//             mockRedis.getRedisValue.mockResolvedValueOnce(mockChps);

//             const result = await service.tenancyChpsServices();

//             expect(mockRedis.getRedisValue).toHaveBeenCalledWith(redisKey);
//             expect(result).toEqual(mockChps);
//         });

//         it('debe consultar en BD si no hay en Redis y luego guardar en Redis', async () => {
//             mockRedis.getRedisValue.mockResolvedValueOnce(null);
//             mockRepository.TenancyCheckpointsDAO.mockResolvedValueOnce(mockChps);

//             const result = await service.tenancyChpsServices();

//             expect(mockRepository.TenancyCheckpointsDAO).toHaveBeenCalled();
//             expect(mockRedis.setRedisValue).toHaveBeenCalledWith(redisKey, mockChps);
//             expect(result).toEqual(mockChps);
//         });
//     });
// });
