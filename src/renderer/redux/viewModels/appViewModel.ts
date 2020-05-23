import { Command } from "../store";

export interface ApplicationState {
    DrawerOpen: boolean;
    Route: string;
}

const defaultApplicationState: ApplicationState = {
    DrawerOpen: true,
    Route: "Welcome"
};

export interface OpenMainDrawerCommand extends Command {
    drawerOpened: boolean;
}

export interface ChangeRouteCommand extends Command {
    newRoute: string;
}

export enum AppCommands {
    OPEN_DRAWER = 'OPEN_DRAWER',
    CHANGE_ROUTE = 'CHANGE_ROUTE'
}

export function ToggleDrawerOpenStatus(drawerOpened: boolean): OpenMainDrawerCommand {
    return { type: AppCommands.OPEN_DRAWER, drawerOpened }
}

export function ChangeRoute(newRoute: string): ChangeRouteCommand {
    return { type: AppCommands.CHANGE_ROUTE, newRoute }
}

export function UpdateApplicationState(state: ApplicationState = defaultApplicationState, action: any): ApplicationState {
    switch (action.type) {
        case AppCommands.OPEN_DRAWER:
            return Object.assign({}, state, {
                DrawerOpen: action.drawerOpened
            });
        case AppCommands.CHANGE_ROUTE:
            return Object.assign({}, state, {
                Route: action.newRoute
            });
        default:
            return state
    }
}