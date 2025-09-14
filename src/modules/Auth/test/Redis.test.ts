// import 'reflect-metadata';
// import { TenancyRedis } from '@infrastructure/redis/RedisClient';

// jest.mock('ioredis');

// describe('TenancyRedis', () => {
//     const mockRedis = {
//         get: jest.fn(),
//         set: jest.fn(),
//         expire: jest.fn(),
//     };

//     const createMockedService = (): TenancyRedis => {
//         // Creamos un objeto vacío y forzamos el redis
//         const service = Object.create(TenancyRedis.prototype) as TenancyRedis;
//         (service as any).redis = mockRedis;
//         return service;
//     };

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     describe('getRedisValue', () => {
//         it('debe retornar el valor parseado si existe', async () => {
//             const service = createMockedService();
//             mockRedis.get.mockResolvedValueOnce(JSON.stringify({ foo: 'bar' }));

//             const result = await service.getRedisValue<{ foo: string }>('clave');
//             expect(mockRedis.get).toHaveBeenCalledWith('clave');
//             expect(result).toEqual({ foo: 'bar' });
//         });

//         it('debe retornar null si la clave no existe', async () => {
//             const service = createMockedService();
//             mockRedis.get.mockResolvedValueOnce(null);

//             const result = await service.getRedisValue<any>('clave');
//             expect(result).toBeNull();
//         });

//         it('debe retornar null si ocurre un error', async () => {
//             const service = createMockedService();
//             mockRedis.get.mockRejectedValueOnce(new Error('Error Redis'));

//             const result = await service.getRedisValue<any>('clave');
//             expect(result).toBeNull();
//         });
//     });

//     describe('setRedisValue', () => {
//         it('debe guardar correctamente en Redis con expire', async () => {
//             const service = createMockedService();
//             const value = { foo: 'bar' };
//             process.env.REDIS_EXPIRE_KEY_SECONDS;

//             await service.setRedisValue('clave', value);

//             expect(mockRedis.set).toHaveBeenCalledWith('clave', JSON.stringify(value));
//             expect(mockRedis.expire).toHaveBeenCalledWith('clave', 172800);
//         });

//         it('debe manejar errores al guardar sin lanzar excepción', async () => {
//             const service = createMockedService();
//             mockRedis.set.mockRejectedValueOnce(new Error('fallo'));

//             await expect(service.setRedisValue('clave', { test: 1 })).resolves.toBeUndefined();
//         });
//     });
// });
