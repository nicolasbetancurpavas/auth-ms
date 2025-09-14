import { injectable, inject } from 'inversify';
import { IDatabase, IMain } from 'pg-promise';
import TYPESDEPENDENCIES from '../../../../modules/Auth/dependencies/TypesDependencies';
import { UserRepository } from '../../../../modules/Auth/domain/repositories/UserRepository';
import { UserVM } from '../../../../modules/Auth/domain/entities/DataInterface';

@injectable()
export default class UserDAO implements UserRepository {
    constructor(
        @inject(TYPESDEPENDENCIES.Postgresql)
        private readonly db: IDatabase<IMain>,
    ) {}

    // Buscar usuario por email
    public async findByEmail(email: string): Promise<(UserVM & { passwordHash: string }) | null> {
        const row = await this.db.oneOrNone<{
            id: number;
            nombre: string;
            email: string;
            rol: 'user' | 'admin';
            password_hash: string;
        }>(
            `
      SELECT id, nombre, email, rol, password_hash
      FROM usuarios
      WHERE email = $1
      `,
            [email],
        );

        if (!row) return null;

        return {
            id: row.id,
            nombre: row.nombre,
            email: row.email,
            rol: row.rol,
            passwordHash: row.password_hash,
        };
    }

    // Crear usuario
    public async create(input: {
        nombre: string;
        email: string;
        passwordHash: string;
        rol: 'user' | 'admin';
    }): Promise<UserVM> {
        const row = await this.db.one<{
            id: number;
            nombre: string;
            email: string;
            rol: 'user' | 'admin';
        }>(
            `
      INSERT INTO usuarios (nombre, email, rol, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, email, rol
      `,
            [input.nombre, input.email, input.rol, input.passwordHash],
        );

        return {
            id: row.id,
            nombre: row.nombre,
            email: row.email,
            rol: row.rol,
        };
    }
}
