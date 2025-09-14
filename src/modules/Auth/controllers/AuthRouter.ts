import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';
import TYPESDEPENDENCIES from '../dependencies/TypesDependencies';
import { validateData } from '@modules/shared/config/schemas/SchemaValidator';
import { authParamsSchema } from '../schemas/AuthSchema';
import { Request } from '@common/http/Request';
import Result from '@common/http/Result';
import LoginUserUseCase from '../usecase/LoginUserUseCase';
import { IRegisterUser } from '../interfaces/IRegisterUser';
export default class AuthRouter {
    async register(req: Request<IRegisterUser>) {
        console.log('request', req.data);
        const useCase = GLOBAL_CONTAINER.get<LoginUserUseCase>(TYPESDEPENDENCIES.LoginUserUseCase);
        const data = validateData<IRegisterUser>(authParamsSchema, req.data);
        const resultado = await useCase.execute(data);
        return Result.ok({ message: resultado });
    }
}
