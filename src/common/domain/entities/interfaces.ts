export interface HeadersSchema {
    x_client_name: string;
    x_client_devices: string;
    x_request_id: string;
    x_timestamp: string;
}

export interface HeadersSchemaNew {
    'x-api-key': string;
    authorization: string;
    'x-request': string;
    'x-client-id': string;
    'x-timestamp': string;
    'x-app-sources': string;
}