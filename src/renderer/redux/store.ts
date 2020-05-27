import { combineReducers, createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk'
import { UpdateApplicationState, ApplicationState } from "./viewModels/appViewModel"
import { UpdateIncidentsState, IncidentsState } from "./viewModels/incidentsViewModel"
import { UpdateAvatarsState, AvatarsState } from "./viewModels/avatarsViewModel"

export interface Command {
    type: string,
}

export interface State {
    UpdateApplicationState: ApplicationState;
    UpdateIncidentsState: IncidentsState;
    UpdateAvatarsState: AvatarsState;
}

const combinedViewModels = combineReducers({
    UpdateApplicationState,
    UpdateIncidentsState,
    UpdateAvatarsState    
});

export const store = createStore(combinedViewModels,
    applyMiddleware(
        thunkMiddleware // lets us dispatch() functions
    ));