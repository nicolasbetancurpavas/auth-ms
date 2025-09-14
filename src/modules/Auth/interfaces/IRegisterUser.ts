export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    rol?: 'user' | 'admin';
}
