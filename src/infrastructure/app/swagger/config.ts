// import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
// import { ENV } from '@modules/shared';

// export const swaggerConfig: FastifyDynamicSwaggerOptions = {
//     routePrefix: `/${ENV.DOMAIN}/${ENV.SERVICE_NAME}/api/docs`,
//     swagger: {
//         info: {
//             title: 'NyS Entregas Documentación Swagger',
//             description: 'Detalle todos los endpoints.',
//             version: '1.0.0',
//             contact: {
//                 name: 'Coordinadora Mercantil S.A',
//                 url: 'http://www.coordinadora.com/',
//                 email: 'it@coordinadora.com',
//             },
//         },
//         host: ENV.HOST.includes('.coordinadora.com') ? ENV.HOST : ENV.HOST + ':' + ENV.PORT,
//         schemes: [ENV.HOST.includes('.coordinadora.com') ? 'https' : 'http'],
//         consumes: ['application/json'],
//         produces: ['application/json'],
//     },
//     hideUntagged: true,
//     exposeRoute: true,
// };

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function generateSchemaFromObject(objetoLiteral: any, description = ''): any {
//     const object = {
//         properties: {} as any,
//         description,
//         type: typeof objetoLiteral,
//     };
//     for (const prop in objetoLiteral) {
//         // eslint-disable-next-line no-prototype-builtins
//         if (!objetoLiteral.hasOwnProperty(prop)) {
//             continue;
//         }
//         if ([null, undefined].includes(objetoLiteral[prop])) {
//             objetoLiteral[prop] = 'unknown';
//         }
//         const type = typeof objetoLiteral[prop];
//         object.properties[prop] = { type, example: objetoLiteral[prop] === 'unknown' ? null : objetoLiteral[prop] };
//         if (Array.isArray(objetoLiteral[prop])) {
//             const firstExampleObj = objetoLiteral[prop][0];
//             if (firstExampleObj) {
//                 object.properties[prop] = {
//                     type: 'array',
//                     items: generateSchemaFromObject(firstExampleObj, description),
//                 };
//                 continue;
//             }
//             object.properties[prop] = { type: 'array' };
//             continue;
//         }
//         if (type === 'object') {
//             object.properties[prop] = generateSchemaFromObject(objetoLiteral[prop], description);
//         }
//     }
//     return object;
// }
// export const beauty = generateSchemaFromObject;
// // export const validationParser = (schema: any) => joiToSwagger(schema).swagger;

// export const DEFAULT_400_ERROR_SCHEMA = {
//     message: 'params.numero_guia should NOT be longer than 11 characters',
//     isError: true,
//     cause: 'Error sin causa',
//     code: null,
//     statusCode: 400,
//     defaultMessage: 'Error handler log',
//     details: {
//         validation: [
//             {
//                 keyword: 'maxLength',
//                 dataPath: '.numero_guia',
//                 schemaPath: '#/properties/numero_guia/maxLength',
//                 params: {
//                     limit: 11,
//                 },
//                 message: 'should NOT be longer than 11 characters',
//             },
//         ],
//         isError: true,
//         message: 'Los valores de entrada no son correctos.',
//         code: 'BAD_MESSAGE',
//         cause: 'Error',
//         validationContext: 'params',
//         statusCode: 400,
//     },
// };
// export const DEFAULT_500_ERROR_SCHEMA = {
//     message: 'Internal Service Error',
//     isError: true,
//     cause: 'Error sin causa',
//     stack: 'Error sin stack',
//     code: null,
//     statusCode: 500,
//     defaultMessage: 'Error handler log',
//     details: {
//         isError: true,
//         message: 'example message',
//         code: 'POSTGRES_ERROR',
//         statusCode: 500,
//         cause: 'REPOSITORY_ERROR',
//     },
// };
