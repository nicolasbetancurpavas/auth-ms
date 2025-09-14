import 'module-alias/register';
import 'reflect-metadata';
import dotenv from 'dotenv';
import { TYPESSERVER } from '@infrastructure/app/server/TypeServer';
import ModulesFactory from '@common/modules/ModulesFactory';
import Modules from '@modules/Auth/AuthModules';

dotenv.config();

async function bootstrap() {
    const modulesFactory = new ModulesFactory();
    const server = modulesFactory.createServer(TYPESSERVER.Fastify);
    modulesFactory.initModules([Modules]);
    server?.start();
}
bootstrap();
