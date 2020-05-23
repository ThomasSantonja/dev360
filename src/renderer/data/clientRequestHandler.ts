import { ipcRenderer, IpcRendererEvent } from "electron";
import { Dictionary } from "src/main/utils/dictionary";
import { ElectronResponse, ElectronRequest } from "src/main/models/app-api-payload";
import hash from "object-hash";

export class ClientRequestHandler {
    constructor() {
        ClientRequestHandler.initialise();
    }

    static initialise() {
        ipcRenderer.on('asynchronous-reply', ClientRequestHandler.onAsynchronousReply);
    }

    static callbackMap: Dictionary<(r: ElectronResponse) => void> = new Dictionary<(r: ElectronResponse) => void>();

    static sendAsyncMessage(message: ElectronRequest, callback: (response: ElectronResponse) => void) {
        try {
            var hashed = hash(callback);
            message.callback = hashed;
            var cb = ClientRequestHandler.callbackMap.Get(hashed);
            if (!cb) {
                ClientRequestHandler.callbackMap.Insert(hashed, callback);
            }
            ipcRenderer.send('asynchronous-message', message);
        }
        catch (problem) {
            console.log(`Error while sending the message ${message?.provider}.${message?.contract} to the application: ${problem}`);
        }
    }

    static onAsynchronousReply(event: IpcRendererEvent, arg: any) {
        console.log("receiving reply from main thread");

        let response = arg as ElectronResponse;
        console.log(`the response is ${response.response}`);
        if (!response) {
            return;
        }
        var cb = ClientRequestHandler.callbackMap.Get(response.originalRequest?.callback);
        if (!cb) {
            console.log(`the callback identified ${response.originalRequest?.callback} could not be found`);
            return;
        }
        console.log(`calling original message callback ${response.originalRequest.callback}`);
        cb.value(response);
    }
}