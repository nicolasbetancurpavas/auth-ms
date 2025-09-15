import { VALIDATE_EMAIL, CREATE_USER } from '@infrastructure/bd/postgresql/dao/querys/queryAuth';

// Normaliza espacios para que no falle por formato
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

describe('queryAuth SQL', () => {
    it('VALIDATE_EMAIL', () => {
        expect(norm(VALIDATE_EMAIL)).toBe(
            'SELECT id, nombre, email, rol, password_hash FROM usuarios WHERE email = $1',
        );
    });

    it('CREATE_USER', () => {
        expect(norm(CREATE_USER)).toBe(
            'INSERT INTO usuarios (nombre, email, rol, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol, password_hash',
        );
    });
});
