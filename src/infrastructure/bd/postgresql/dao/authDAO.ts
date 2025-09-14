import { injectable, inject } from 'inversify';
import { IDatabase, IMain } from 'pg-promise';
import TYPESDEPENDENCIES from '../../../../modules/Auth/dependencies/TypesDependencies';
import { UserRow, toUserAuth, toUserVM } from '../models/UserRow';
import { UserVM } from '@modules/Auth/domain/entities/DataInterface';
import { CreateUserInput, UserRepository } from '@modules/Auth/domain/repositories/UserRepository';
import { CREATE_USER, VALIDATE_EMAIL } from './querys/queryAuth';

@injectable()
export default class UserDAO implements UserRepository {
    constructor(
        @inject(TYPESDEPENDENCIES.Postgresql)
        private readonly db: IDatabase<IMain>,
    ) {}

    async findByEmail(email: string) {
        const row = await this.db.oneOrNone<UserRow>(VALIDATE_EMAIL, [email]);
        return row ? toUserAuth(row) : null;
    }

    async create(input: CreateUserInput): Promise<UserVM> {
        const row = await this.db.one<UserRow>(CREATE_USER, [input.nombre, input.email, input.rol, input.passwordHash]);
        return toUserVM(row);
    }
}
