export type UserVM = {
    id: number;
    nombre: string;
    email: string;
    rol: 'user' | 'admin';
};

export type HeadersChpsInterface = IHeaderChpsV1 | IHeaderChpsV2 | IHeaderChpsV3;
export interface IHeaderChpsV1 {
    //v1
    x_client_name?: string;
    x_client_devices?: string;
    x_request_id?: string;
    x_timestamp?: string;
    //v2
    'x-client-name'?: string;
    'x-client-id'?: string;
    'x-request-id'?: string;
    'x-timestamp'?: string;

    authorization?: string;
}

export interface IHeaderChpsV2 {
    //v1
    x_client_name?: string;
    x_client_devices?: string;
    x_request_id?: string;
    x_timestamp?: string;
    //v2
    'x-client-name'?: string;
    'x-client-id'?: string;
    'x-request-id'?: string;
    'x-timestamp'?: string;

    authorization: string;
}

export interface IHeaderChpsV3 {
    //v1
    x_client_name?: string;
    x_client_devices?: string;
    x_request_id?: string;
    x_timestamp?: string;
    x_request?: string;
    //v2
    'x-client-name'?: string;
    'x-request-id'?: string;
    //v3
    'x-api-key': string;
    'x-client-id': string;
    'x-request': string;
    'x-timestamp': string;
    authorization: string;
    'x-app-sources': string;
}
