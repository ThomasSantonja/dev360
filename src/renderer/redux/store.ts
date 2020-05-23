import { combineReducers, createStore } from "redux";
import { todoStateEditor, todoFilterStateEditor, Todo } from "./viewModels/todoViewModel"
import { UpdateApplicationState, ApplicationState } from "./viewModels/appViewModel"

export interface Command {
    type: string,
}

export interface State {
    todoFilterStateEditor: string;
    todoStateEditor: Array<Todo>;
    UpdateApplicationState: ApplicationState;
}


const combinedViewModels = combineReducers({
    todoFilterStateEditor,
    todoStateEditor,
    UpdateApplicationState
})

export const store = createStore(combinedViewModels);