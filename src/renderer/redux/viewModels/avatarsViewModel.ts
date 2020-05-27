import { Command } from "../store";
import { JiraModels } from "../../../main/models/jira-models";
import { RefreshStrategy } from "../../../main/main-api";
import { ElectronRequest, ElectronResponse } from "../../../main/models/app-api-payload";
import { Dispatch } from "react";
import { ClientRequestHandler } from "../../data/clientRequestHandler";
import { TimeSpan } from "../../../main/utils/timespan";
import { NvpArray } from "../../../main/utils/nvp-array";
import Timeline from "../../../main/utils/timeline";
import { LocalCache } from "../../../main/storage/store";
import { JiraApi } from "../../../main/jira/jira-api";

export interface AvatarsState {
    avatars: LocalCache;
};

const defaultCache: AvatarsState = {
    avatars: new LocalCache()
};

export interface FetchAvatarCommand extends Command {
}

export interface FetchAvatarSuccessCommand extends Command {
    originalRequest: ElectronRequest;
    payload: LocalCache
};

export enum AvatarsCommands {
    FETCH_AVATAR = 'FETCH_AVATAR',
    FETCH_AVATAR_FAILURE = 'FETCH_AVATAR_FAILURE',
    FETCH_AVATAR_SUCCESS = 'FETCH_AVATAR_SUCCES',
}

export function FetchAvatarSuccess(originalRequest: ElectronRequest, payload: LocalCache): FetchAvatarSuccessCommand {
    return { type: AvatarsCommands.FETCH_AVATAR_SUCCESS, originalRequest, payload };
}

export function UpdateAvatarsState(state: AvatarsState = defaultCache, action: Command): AvatarsState {
    switch (action.type) {
        case AvatarsCommands.FETCH_AVATAR:
            //if tomorrow we want to display a loader per avatar we can record each key being retrieved here
            break;
        case AvatarsCommands.FETCH_AVATAR_SUCCESS:
            var fetchAvatarSuccessAction = action as FetchAvatarSuccessCommand;
            if (!fetchAvatarSuccessAction) {
                console.error(`wrong parameter reveived as the command for avatar fetch`);
            }
            var newcache = LocalCache.Copy(state.avatars);
            newcache.Insert(fetchAvatarSuccessAction.originalRequest.parameters, fetchAvatarSuccessAction.payload);
            return Object.assign<{}, AvatarsState, AvatarsState>(
                {},
                state,
                {
                    isFetching: false,
                    avatars: newcache
                } as AvatarsState);
    }
    return state;
}

export function FetchAvatar(request: ElectronRequest) {
    console.info(`attempting to fetch avatar for ${request?.provider}.${request?.contract} using key: ${request?.parameters}`);
    return function (dispatch: Dispatch<any>) {
        // First dispatch: the app state is updated to inform
        // that the API call is starting.  
        //dispatch(FetchDataStart(request.parameters, IncidentsCommands.FETCH_AVATAR));

        ClientRequestHandler.sendAsyncMessage(request, (response: ElectronResponse) => {

            dispatch(FetchAvatarSuccess(response.originalRequest, response.response));
        });
    }
}