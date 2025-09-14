jest.mock('@infrastructure/redis/adapter/redis', () => {
    return {
        RedisConnection: {
            on: jest.fn().mockReturnThis(),
            rpush: jest.fn(),
            get: jest.fn(),
            set: jest.fn(),
            expire: jest.fn(),
        },
        getRedisConnection: jest.fn().mockReturnValue({
            on: jest.fn().mockReturnThis(),
            rpush: jest.fn(),
            get: jest.fn(),
            set: jest.fn(),
            expire: jest.fn(),
        }),
    };
});
