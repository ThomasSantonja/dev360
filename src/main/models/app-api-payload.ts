export interface ElectronRequest {
    callback: string;
    provider: string;
    contract: string;
    parameters: any;
}

export interface ElectronResponse {
    originalRequest: ElectronRequest;
    response: any;
}