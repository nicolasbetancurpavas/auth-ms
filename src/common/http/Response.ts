interface ErrorResponse {
    message: string;
}

export interface ResponseMethod<T> {
    data: T;
    message: string;
}
export interface Response<T> {
    isError: boolean;
    response: T | ErrorResponse;
    status: number;
}
