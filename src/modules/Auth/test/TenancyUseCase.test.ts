// import TenancyUseCase from '../usecase/LoginUserUseCase';
// import TenencyDomainService from '../domain/services/AuthDomainServices';
// import { IDataIn } from '../domain/entities/DataInterface';
// import { ITenancyTypes, ITenancyTypeChp } from '../domain/models/RequestTenancyData';

// describe('TenancyUseCase', () => {
//     let useCase: TenancyUseCase;
//     let domainServiceMock: jest.Mocked<TenencyDomainService>;

//     const dataIn: IDataIn = {
//         id_checkpoint: 100,
//         etiqueta1d: 3222,
//     };

//     const masterTenancy = {
//         tenancyChp: { nombre_tenencia: 'Plataforma' },
//         allTenancyChps: [
//             { id: 1, nombre_tenencia: 'Plataforma' },
//             { id: 2, nombre_tenencia: 'Almacén' },
//         ],
//     };

//     const getData = {
//         id_checkpoint: 100,
//         guia: '123',
//         etiqueta1d: 'ETQ123',
//         recurso_tenencia: '987',
//         id_tipo_tenencia_actual: 1,
//         nombre_tenencia_actual: '',
//         tipos_tenencia_asociados: [],
//     };

//     beforeEach(() => {
//         domainServiceMock = {
//             getTenanciesChpWithFilter: jest.fn().mockResolvedValue(masterTenancy),
//             getTenancyByUnit: jest.fn().mockResolvedValue(getData),
//             getTenancyTypes: jest.fn(),
//             tenancyTypesServices: jest.fn(),
//             tenancyChpsServices: jest.fn(),
//         } as any;

//         useCase = new TenancyUseCase(domainServiceMock);
//     });

//     it('should return remodeled tenancy data from executeTenancyByUnit', async () => {
//         const result = await useCase.executeTenancyByUnit(dataIn);

//         expect(domainServiceMock.getTenanciesChpWithFilter).toHaveBeenCalledWith(100);
//         expect(domainServiceMock.getTenancyByUnit).toHaveBeenCalledWith(dataIn);
//         expect(result).toEqual({
//             ...getData,
//             nombre_tenencia_actual: 'Plataforma',
//             tipos_tenencia_asociados: masterTenancy.allTenancyChps,
//         });
//     });

//     it('should return tenancy types list from executeTenancyTypes', async () => {
//         const checkpoints: ITenancyTypes[] = [
//             { id_tipo_tenencia: 1, nombre_tenencia: 'Almacén', activo: true },
//             { id_tipo_tenencia: 2, nombre_tenencia: 'Plataforma', activo: true },
//         ];

//         domainServiceMock.tenancyTypesServices.mockResolvedValue(checkpoints);

//         const result = await useCase.executeTenancyTypes();

//         expect(domainServiceMock.tenancyTypesServices).toHaveBeenCalled();
//         expect(result).toEqual(checkpoints);
//     });

//     it('should return tenancy checkpoint list from executeTenancyChps', async () => {
//         const chpList: ITenancyTypeChp[] = [
//             { id_checkpoint: 1, id_tipo_tenencia: 1, nombre_tenencia: 'Plataforma' },
//             { id_checkpoint: 2, id_tipo_tenencia: 2, nombre_tenencia: 'Almacén' },
//         ];

//         domainServiceMock.tenancyChpsServices.mockResolvedValue(chpList);

//         const result = await useCase.executeTenancyChp();

//         expect(domainServiceMock.tenancyChpsServices).toHaveBeenCalled();
//         expect(result).toEqual(chpList);
//     });
// });
