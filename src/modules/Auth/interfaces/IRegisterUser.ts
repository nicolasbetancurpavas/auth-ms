export interface IRegisterUser {
    nombre: string;
    email: string;
    password: string;
    rol?: 'user' | 'admin';
}
