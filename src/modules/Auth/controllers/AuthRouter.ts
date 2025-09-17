import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import TYPESDEPENDENCIES from '../dependencies/TypesDependencies';
import { validateData } from '@modules/shared/config/schemas/SchemaValidator';
import { registerParamsSchema } from '../schemas/RegisterSchema';
import { Request } from '@common/http/Request';
import Result from '@common/http/Result';
import { IRegisterUser } from '../interfaces/IRegisterUser';
import { ILoginUser } from '../interfaces/ILoginUser';
import { loginParamsSchema } from '../schemas/LoginShema';
import RegisterUserUseCase from '../usecase/RegisterUserUseCase';
import LoginUserUseCase from '../usecase/LoginUserUseCase';
import { validateHeaders } from '../schemas/ShemaValidator';
import { authHeadersSchema, extractBearer } from '../schemas/HeadersShema';
import { TokenService } from '../domain/services/AuthDomainServices';
export default class AuthRouter {
    async register(req: Request<IRegisterUser>) {
        // validateHeaders(registerHeadersSchema, req.headers);
        const useCase = GLOBAL_CONTAINER.get<RegisterUserUseCase>(TYPESDEPENDENCIES.RegisterUserUseCase);
        const data = validateData<IRegisterUser>(registerParamsSchema, req.data);
        const result = await useCase.execute(data);
        return Result.created({
            message: 'Usuario creado con éxito',
            data: result,
        });
    }
    async login(req: Request<ILoginUser>) {
        // validateHeaders(registerHeadersSchema, req.headers);
        const data = validateData<ILoginUser>(loginParamsSchema, req.data);
        const useCase = GLOBAL_CONTAINER.get<LoginUserUseCase>(TYPESDEPENDENCIES.LoginUserUseCase);
        const out = await useCase.execute(data);
        const res = Result.ok(out);
        (res as any).headers = { 'Cache-Control': 'no-store, max-age=0' };
        return res;
    }
    async validate(req: Request<unknown>) {
        const headers = validateHeaders(authHeadersSchema, req.headers);
        const token = extractBearer(headers.authorization as string);
        const tokens = GLOBAL_CONTAINER.get<TokenService>(TYPESDEPENDENCIES.TokenService);
        const payload = tokens.verify(token);
        const res = Result.ok({ valid: true, payload });
        (res as any).headers = { 'Cache-Control': 'no-store, max-age=0' };
        return res;
    }
}
