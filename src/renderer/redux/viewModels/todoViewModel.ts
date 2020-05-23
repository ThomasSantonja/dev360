import { Command } from "../store";

export interface Todo {
    text: string;
    completed: boolean;
    id: number;
}

export interface TodoTextCommand extends Command {
    text: string;
}

export interface TodoIndexCommand extends Command {
    index: number;
}

export interface FilterCommand extends Command {
    filter: any
}

export enum TodoCommandNames {
    ADD_TODO = 'ADD_TODO',
    TOGGLE_TODO = 'TOGGLE_TODO'
}

export enum TodoFilterCommandNames {
    SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER',
    SHOW_ALL = 'SHOW_ALL',
    SHOW_COMPLETED = 'SHOW_COMPLETED',
    SHOW_ACTIVE = 'SHOW_ACTIVE'
}

export function addTodo(text: string): TodoTextCommand {
    return { type: TodoCommandNames.ADD_TODO, text }
}

export function toggleTodo(index: number): TodoIndexCommand {
    return { type: TodoCommandNames.TOGGLE_TODO, index }
}

export function setVisibilityFilter(filter: any): FilterCommand {
    return { type: TodoFilterCommandNames.SET_VISIBILITY_FILTER, filter }
}

export const getVisibleTodos = (todos: Array<Todo>, filter: string) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed)
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed)
        default:
            console.log(`command ${filter} is unknow returning an empty list`);
            return [];
    }
}

export function todoFilterStateEditor(state = TodoFilterCommandNames.SHOW_ALL, action: FilterCommand) {
    switch (action.type) {
        case TodoFilterCommandNames.SET_VISIBILITY_FILTER:
            return action.filter
        default:
            return state
    }
}

export function todoStateEditor(state: Array<Todo> = [], action: any): Array<Todo> {
    switch (action.type) {
        case TodoCommandNames.ADD_TODO:
            var index = state.length;
            return [
                ...state,
                {
                    text: action.text,
                    completed: false,
                    id: index
                }
            ]
        case TodoCommandNames.TOGGLE_TODO:
            return state.map((todo, index) => {
                if (index === action.index) {
                    return Object.assign({}, todo, {
                        completed: !todo.completed
                    })
                }
                return todo
            })
        default:
            return state
    }
}