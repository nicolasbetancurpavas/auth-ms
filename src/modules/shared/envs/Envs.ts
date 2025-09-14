import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { validateEnvs } from '@modules/shared/envs/Validate';
const envFile = existsSync('.env.local');
if (envFile) {
    dotenv.config({
        path: '.env.local',
    });
} else {
    dotenv.config();
}
export const ENV = {
    POSTGRES_HOST: process.env.POSTGRES_HOST ?? 'localhost',
    DOMAIN: process.env.DOMAIN ?? 'mio',
    SERVICE_NAME: process.env.SERVICE_NAME ?? 'plantilla-clean-code',
    ENV: process.env.ENV ?? 'local',
    PG_PORT: process.env.PG_PORT ?? '5432',
    POSTGRES_USER: process.env.POSTGRES_USER ?? 'user',
    POSTGRES_PASS: process.env.POSTGRES_PASS ?? 'cualquier_cosa',
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ?? 'database',
    PORT: process.env.PORT ?? '8080',
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN ?? 'localhost',
    HOST: process.env.HOST ?? '0.0.0.0',
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX ?? '400',
    RATE_LIMIT_TIME_WINDOW: process.env.RATE_LIMIT_TIME_WINDOW ?? '60000',
    JWT_SECRET: process.env.JWT_SECRET ?? 'secret-dev',
    ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL ?? '1h', // 👈 string
};

if (!envFile) validateEnvs(ENV);
