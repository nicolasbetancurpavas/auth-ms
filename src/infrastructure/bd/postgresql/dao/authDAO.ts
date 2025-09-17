import { injectable, inject } from 'inversify';
import { IDatabase, IMain } from 'pg-promise';
import TYPESDEPENDENCIES from '../../../../modules/Auth/dependencies/TypesDependencies';
import { UserRow, toCreateUserParams, toUserAuth, toUserVM } from '../models/UserRow';
import { UserVM } from '@modules/Auth/domain/entities/DataInterface';
import { CreateUserInput, UserRepository } from '@modules/Auth/domain/repositories/UserRepository';
import { CREATE_USER, VALIDATE_EMAIL } from './querys/queryAuth';
import { AuthErrorCode, AuthException } from '@common/http/exceptions';
import CustomError from '@common/utils/CustomError';

@injectable()
export default class UserDAO implements UserRepository {
    constructor(
        @inject(TYPESDEPENDENCIES.Postgresql)
        private readonly db: IDatabase<IMain>,
    ) {}

    async findByEmail(email: string) {
        try {
            const row = await this.db.oneOrNone<UserRow>(VALIDATE_EMAIL, [email]);
            return row ? toUserAuth(row) : null;
        } catch (e) {
            throw new CustomError(e);
        }
    }

    async create(input: CreateUserInput): Promise<UserVM> {
        try {
            const row = await this.db.one<UserRow>(CREATE_USER, toCreateUserParams(input));
            return toUserVM(row);
        } catch (e: any) {
            if (e?.code === '23505') {
                // unique_violation
                throw new AuthException(AuthErrorCode.EMAIL_ALREADY_EXISTS);
            }
            throw e;
        }
    }
}
