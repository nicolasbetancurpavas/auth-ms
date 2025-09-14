/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApiError, AxiosError, PostgresError, PubSubException, RedisError } from '@common/http/exceptions';
import { Circuit, RetryMode, Retry } from 'mollitia';

export interface RetryConfig {
    attempts?: number;
    interval?: number;
    mode?: RetryMode;
    factor?: number;
    maxInterval?: number;
}
export const RetryOnPubSubException = (config?: RetryConfig) => RetryOnException(config, PubSubException);
export const RetryOnAxiosErrorException = (config?: RetryConfig) => RetryOnException(config, AxiosError);
export const RetryOnApiErrorException = (config?: RetryConfig) => RetryOnException(config, ApiError);
export const RetryOnPostgresErrorException = (config?: RetryConfig) => RetryOnException(config, PostgresError);
export const RetryOnRedisErrorException = (config?: RetryConfig) => RetryOnException(config, RedisError);
export const RetryOnGenericException = (config?: RetryConfig) => RetryOnException(config);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RetryOnException(config?: RetryConfig, type: any = null) {
    const defaultConfig: RetryConfig = {
        attempts: 3,
        interval: 2000,
        maxInterval: 10000,
        factor: 2,
        mode: RetryMode.EXPONENTIAL,
    };
    const circuit = new Circuit({
        options: {
            modules: [
                new Retry({
                    ...Object.assign(defaultConfig, config ?? {}),
                    onRejection: (error: { [x: string]: string }) => {
                        if ((type && error instanceof type) || !type) {
                            return true;
                        }
                        return false;
                    },
                }),
            ],
        },
    });
    return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            return circuit.fn(originalMethod.bind(this)).execute(...args);
        };
        return descriptor;
    };
}
