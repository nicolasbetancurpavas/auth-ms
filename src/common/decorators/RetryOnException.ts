/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AuthException } from '@common/http/exceptions';
import { Circuit, RetryMode, Retry } from 'mollitia';

export interface RetryConfig {
    attempts?: number; // número de intentos (incluye el primero fallido)
    interval?: number; // ms inicial entre reintentos
    mode?: RetryMode; // LINEAR | EXPONENTIAL
    factor?: number; // multiplicador para EXPONENTIAL
    maxInterval?: number; // tope del intervalo
}

/** Predicado: true => reintenta, false => no reintenta */
export type RetryPredicate = (err: unknown) => boolean;

/** No reintentes en errores de entrada/negocio comunes de auth */
function isNonRetryableBusiness(err: unknown): boolean {
    const e = err as any;
    if (e?.isJoi || e?.name === 'ValidationError') return true; // Joi
    if (e instanceof AuthException) return true; // dominio auth
    return false;
}

/** Predicado de PG transitorio: caídas/timeout/conexión, no duplicado 23505 */
export function isTransientPostgresError(err: unknown): boolean {
    const e = err as any;
    const code = String(e?.code ?? '');
    // Códigos comunes transitorios (PG/client)
    const transientPg = new Set([
        '57P01', // admin_shutdown
        '57P02', // crash_shutdown
        '57P03', // cannot_connect_now
        '53300', // too_many_connections
        '08006', // connection_failure
        '08001', // sqlclient_unable_to_establish_sqlconnection
        '08003', // connection_does_not_exist
        '08000', // connection_exception
    ]);
    if (transientPg.has(code)) return true;
    // Errores de red típicos de Node
    const sys = String(e?.errno ?? e?.code ?? '').toUpperCase();
    if (['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED', 'EHOSTUNREACH'].includes(sys)) return true;
    // NUNCA reintentar duplicado (conflicto de negocio)
    if (code === '23505') return false;
    return false;
}

/** Decorator base con predicado */
export function RetryWhen(config?: RetryConfig, predicate?: RetryPredicate) {
    const defaults: Required<RetryConfig> = {
        attempts: 3,
        interval: 2000,
        maxInterval: 10000,
        factor: 2,
        mode: RetryMode.EXPONENTIAL,
    };
    const options = { ...defaults, ...(config ?? {}) };

    const circuit = new Circuit({
        options: {
            modules: [
                new Retry({
                    ...options,
                    onRejection: (error: unknown) => {
                        // No reintentar en errores de negocio/validación
                        if (isNonRetryableBusiness(error)) return false;
                        // Si hay predicado, úsalo
                        if (predicate) return !!predicate(error);
                        // Sin predicado: reintenta por defecto (pero ya filtramos negocio)
                        return true;
                    },
                }),
            ],
        },
    });

    return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
        const original = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            return circuit.fn(original.bind(this)).execute(...args);
        };
        return descriptor;
    };
}

/** Helper: reintenta solo ante errores transitorios de Postgres */
export const RetryOnPostgresTransient = (cfg?: RetryConfig) => RetryWhen(cfg, isTransientPostgresError);

/** Helper: reintento genérico seguro (no Joi/AuthException) */
export const RetryOnGeneric = (cfg?: RetryConfig) => RetryWhen(cfg);
