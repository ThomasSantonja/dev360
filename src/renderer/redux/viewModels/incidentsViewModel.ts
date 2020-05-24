import { Command } from "../store";
import { JiraModels } from "../../../main/models/jira-models";
import { RefreshStrategy } from "../../../main/main-api";
import { ElectronRequest, ElectronResponse } from "../../../main/models/app-api-payload";
import { Dispatch } from "react";
import { ClientRequestHandler } from "../../../renderer/data/clientRequestHandler";

export interface IncidentsState {
    payload: JiraModels.RootObject;
    filters: any;
    isFetching: boolean;
    lastUpdate?: Date;
}

const defaultIncidentsState: IncidentsState = {
    payload: null as unknown as JiraModels.RootObject,
    filters: null,
    isFetching: false
};

export interface FetchDataCommand extends Command {
    dataAccess: RefreshStrategy;
}

export interface FetchDataSuccessCommand extends Command {
    originalRequest: ElectronRequest;
    payload: JiraModels.RootObject
};

export enum IncidentsCommands {
    FETCH_DATA = 'FETCH_DATA',
    FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE',
    FETCH_DATA_SUCCES = 'FETCH_DATA_SUCCES',
}

export function FetchDataStart(dataAccess: RefreshStrategy): FetchDataCommand {
    return { type: IncidentsCommands.FETCH_DATA, dataAccess };
}

export function FetchDataSuccess(originalRequest: ElectronRequest, payload: JiraModels.RootObject): FetchDataSuccessCommand {
    return { type: IncidentsCommands.FETCH_DATA_SUCCES, originalRequest, payload };
}

export function UpdateIncidentsState(state: IncidentsState = defaultIncidentsState, action: Command): IncidentsState {
    switch (action.type) {
        case IncidentsCommands.FETCH_DATA:
            return Object.assign<{}, IncidentsState, IncidentsState>(
                {},
                state,
                {
                    isFetching: true
                } as IncidentsState);
        case IncidentsCommands.FETCH_DATA_SUCCES:
            var fetchSuccessAction = action as FetchDataSuccessCommand;
            if (!fetchSuccessAction) {
                console.log(`wrong parameter reveived as the command for successful fetch`);
            }
            return Object.assign<{}, IncidentsState, IncidentsState>(
                {},
                state,
                {
                    isFetching: false,
                    lastUpdate: fetchSuccessAction.payload?.lastAccessDate,
                    payload: fetchSuccessAction.payload
                } as IncidentsState);
        default:
            return state
    }
}

export function FetchData(request: ElectronRequest) {
    console.log(`attempting to fetch data for ${request?.provider}.${request?.contract}`);
    return function (dispatch: Dispatch<any>) {
        // First dispatch: the app state is updated to inform
        // that the API call is starting.  
        dispatch(FetchDataStart(request.parameters))

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.  
        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.
        ClientRequestHandler.sendAsyncMessage(request, (response: ElectronResponse) => {
            dispatch(FetchDataSuccess(response.originalRequest, response.response));
        });
    }
}