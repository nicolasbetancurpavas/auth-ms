export interface ITenancyByUnitResponse {
    guia: string;
    id_checkpoint: number;
    etiqueta1d: string;
    recurso_tenencia_actual: number;
    id_tipo_tenencia_actual: number;
    nombre_tenencia_actual: string;
    tipos_tenencia_asociados: ITenancyTypeChp[];
}

export interface ITenancyTypeChp {
    id_checkpoint?: number;
    nombre_checkpoint?: string;
    id_tipo_tenencia: number;
    nombre_tenencia: string;
}

export interface ITenancyTypes {
    id_tipo_tenencia: number;
    nombre_tenencia: string;
    activo: boolean;
}
export interface ITenancyTypeResponse {
    id_tipo_tenencia: number;
    nombre_tenencia: string;
    id_checkpoint: number;
}
