export const VALIDATE_EMAIL = `SELECT id, nombre, email, rol, password_hash
       FROM usuarios
       WHERE email = $1`;

export const CREATE_USER = `INSERT INTO usuarios (nombre, email, rol, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, password_hash`;
