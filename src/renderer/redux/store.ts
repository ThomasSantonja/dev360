import { combineReducers, createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk'
import { UpdateApplicationState, ApplicationState } from "./viewModels/appViewModel"
import { UpdateIncidentsState, IncidentsState } from "./viewModels/incidentsViewModel"

export interface Command {
    type: string,
}

export interface State {
    UpdateApplicationState: ApplicationState;
    UpdateIncidentsState: IncidentsState;
}

const combinedViewModels = combineReducers({
    UpdateApplicationState,
    UpdateIncidentsState
});

export const store = createStore(combinedViewModels,
    applyMiddleware(
        thunkMiddleware // lets us dispatch() functions
    ));