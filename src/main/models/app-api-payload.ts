export interface ElectronRequest {
    callback: string;
    provider: string;
    contract: string;
    parameters: any;
    callBackParameters: any;
}

export interface ElectronResponse {
    originalRequest: ElectronRequest;
    response: any;
}