export interface GuideTenureDAO {
    id_checkpoint: string;
    guia: string;
    unidad: string;
}

export default interface Publicador {
    publish(mensaje: unknown, topico: string, project: string, atributos?: Record<string, string>): Promise<void>;
}
