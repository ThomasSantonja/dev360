import { ipcMain, IpcMainEvent } from "electron";
import { ElectronRequest, ElectronResponse } from "./models/app-api-payload";
import { Dictionary } from "./utils/dictionary";
import { JiraApi } from "./jira/jira-api";

export abstract class ApiContract {

}

export enum RefreshStrategy {
    only_local,
    remote_if_no_local,
    force_remote
}

export default class MainApi {

    registeredProviders: Dictionary<ApiContract>;

    static ASYNC_REPLY: string = 'asynchronous-reply';

    constructor() {
        this.registeredProviders = new Dictionary<ApiContract>();

        ipcMain.on('asynchronous-message', this.onAsyncMessageReceived.bind(this));
        ipcMain.on('synchronous-message', this.OnSyncMessageReceived.bind(this));

        this.registeredProviders.Insert(JiraApi.JIRA_PROVIDER, new JiraApi());
    }

    async onAsyncMessageReceived(event: IpcMainEvent, arg: any) {
        var req = arg as ElectronRequest;
        var resp: ElectronResponse = { originalRequest: req, response: undefined };
        if (!req) { resp.response = `unable to perform the command, reason: the request provided is null`; }
        var provider: ApiContract = {};
        try {
            provider = this.registeredProviders.Get(req.provider).value;
            if (!provider) { resp.response = `unable to perform the command, reason: the contract named ${req.provider} is not registered`; }
        } catch (error) {
            resp.response = `unable to perform the command, reason: ${error}`;
            event.reply(MainApi.ASYNC_REPLY, resp);
            return;
        }
        try {
            resp.response = await (provider as any)[req.contract](req.parameters);
        } catch (problem) {
            resp.response = `unable to perform the command ${req.provider}.${req.contract}, reason: ${problem}`;
        }
        event.reply(MainApi.ASYNC_REPLY, resp);
    }

    OnSyncMessageReceived(event: IpcMainEvent, arg: any) {
        event.returnValue = arg + 'received';
    }
}