import { Command, store } from "../store";
import { JiraModels } from "../../../main/models/jira-models";
import { RefreshStrategy } from "../../../main/main-api";
import { ElectronRequest, ElectronResponse } from "../../../main/models/app-api-payload";
import { Dispatch } from "react";
import { ClientRequestHandler } from "../../../renderer/data/clientRequestHandler";
import { TimeSpan } from "../../../main/utils/timespan";
import { NvpArray } from "../../../main/utils/nvp-array";
import Timeline from "../../../main/utils/timeline";
import { LocalCache } from "../../../main/storage/store";
import { JiraApi } from "../../../main/jira/jira-api";
import { NoEncryption } from "@material-ui/icons";

export interface IncidentsState {
    payload: JiraIncidentRootObject;
    filteredPayload: JiraIncidentRootObject;
    filters: IncidentsFilters;
    isFetching: boolean;
    hasFetched: boolean;
    lastUpdate?: Date;
};

const defaultIncidentsState: IncidentsState = {
    payload: null as unknown as JiraIncidentRootObject,
    filteredPayload: null as unknown as JiraIncidentRootObject,
    filters: { noFilters: true } as IncidentsFilters,
    hasFetched: false,
    isFetching: false
};


export enum IncidentFilterTypes {
    rootCauses = "rootCauses",
    statuses = "statuses",
    teams = "teams",
    services = "services",
    severities = "severities",
    assignees = "assignees",
    years = "years",
    keys = "keys",
}

export type IncidentFilterTypesStrings = keyof typeof IncidentFilterTypes;

export interface IncidentsFilters {
    noFilters: boolean;
    rootCauses: Array<string>;
    statuses: Array<string>;
    teams: Array<string>;
    services: Array<string>;
    severities: Array<string>;
    assignees: Array<string>;
    years: Array<string>;
    keys: Array<string>;
}

export interface JiraIncidentRootObject extends JiraModels.RootObject {
    totalDetection: TimeSpan;
    totalFix: TimeSpan;
    totalResolution: TimeSpan;
    totalClosure: TimeSpan;
    //the chart dedicated pre formatted data: {name:string, value:string} as a default
    rootCauses: NvpArray;
    statuses: NvpArray;
    teams: NvpArray;
    services: NvpArray;
    severities: NvpArray;
    assignees: NvpArray;
    timeline: Timeline;
    lastWeek: number;
}

export enum TimeTypes {
    Detection = "Detection",
    Fix = "Fix",
    Resolution = "Resolution",
    Closure = "Closure"
}

export interface FetchDataCommand extends Command {
    dataAccess: RefreshStrategy;
}

export interface FiltersUpdatedCommand extends Command {
    filters: IncidentsFilters;
    reset: boolean;
}

export interface FetchDataSuccessCommand extends Command {
    originalRequest: ElectronRequest;
    payload: JiraIncidentRootObject
};

export enum IncidentsCommands {
    FETCH_DATA = 'FETCH_DATA',
    FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE',
    FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCES',
    FILTERS_UPDATED = 'FILTERS_UPDATED'
}

const NONE_TEXT = "None";
const EXTERNAL_REASON = "External reason";

export function FetchDataStart(dataAccess: RefreshStrategy, type: string): FetchDataCommand {
    return { type: type, dataAccess };
}

export function FetchDataSuccess(originalRequest: ElectronRequest, payload: JiraIncidentRootObject): FetchDataSuccessCommand {
    return { type: IncidentsCommands.FETCH_DATA_SUCCESS, originalRequest, payload };
}

export function FiltersUpdated(filters: IncidentsFilters, reset: boolean = false): FiltersUpdatedCommand {
    return { type: IncidentsCommands.FILTERS_UPDATED, filters, reset };
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
        case IncidentsCommands.FETCH_DATA_SUCCESS:
            var fetchSuccessAction = action as FetchDataSuccessCommand;
            if (!fetchSuccessAction) {
                console.error(`wrong parameter reveived as the command for successful fetch`);
            }
            var filterPayload = fetchSuccessAction.payload;
            if (!state.filters.noFilters) {
                filterPayload = sanitizeIncidents(applyFilter(filterPayload, state.filters));
            }
            return Object.assign<{}, IncidentsState, IncidentsState>(
                {},
                state,
                {
                    isFetching: false,
                    hasFetched: true,
                    lastUpdate: fetchSuccessAction.payload?.lastAccessDate,
                    payload: fetchSuccessAction.payload,
                    filteredPayload: filterPayload
                } as IncidentsState);
        case IncidentsCommands.FILTERS_UPDATED:
            var filterUpdateAction = action as FiltersUpdatedCommand;
            if (!filterUpdateAction) {
                console.error(`wrong parameter reveived as the command for updated filter`);
            }

            var filters = Object.assign<{}, IncidentsFilters, IncidentsFilters>(
                {},
                state.filters,
                filterUpdateAction.reset ? InitialiseFilters(state.payload) : filterUpdateAction.filters
            );
            var filteredPayload: JiraIncidentRootObject;
            if (filters.noFilters) {
                filteredPayload = state.payload;
            } else {
                filteredPayload = sanitizeIncidents(applyFilter(state.payload, filters));
            }
            return Object.assign<{}, IncidentsState, IncidentsState>(
                {},
                state,
                {
                    filters,
                    filteredPayload
                } as IncidentsState);
        default:
            return state
    }
}

function applyFilter(payload: JiraIncidentRootObject, filters: IncidentsFilters): JiraIncidentRootObject {
    //we check for all the filters, which incident fits
    var filteredPayload: JiraModels.RootObject = { total: 0, issues: new Array<JiraModels.Issue>() } as JiraModels.RootObject;
    if (filters?.noFilters ?? true) {
        return payload;
    }
    for (let issue of payload.issues) {
        if (!filters.assignees.includes(issue.fields.assignee.displayName ?? NONE_TEXT)) {
            continue;
        }
        if (!filters.rootCauses.includes(issue.fields?.customfield_14918?.value ?? NONE_TEXT)) {
            continue;
        }
        if (!filters.severities.includes(issue.fields?.customfield_10201?.value ?? NONE_TEXT)) {
            continue;
        }
        if (!filters.statuses.includes(issue.fields?.status?.name ?? NONE_TEXT)) {
            continue;
        }
        //services, teams and years are specific, so we will start with those filters for now
        //creating the array of matching services
        if (!hasService(filters.services, issue)) {
            continue;
        }
        if (!hasTeam(filters.teams, issue)) {
            continue;
        }
        var incidentDate;
        if (issue.fields.customfield_14871) { //introduction
            incidentDate = issue.fields.customfield_14871 = new Date(issue.fields.customfield_14871);
        } else {
            incidentDate = new Date(issue.fields.created);
        }
        if (!filters.years.includes(incidentDate.getFullYear().toString())) {
            continue;
        }
        filteredPayload.issues.push(issue);
    }
    filteredPayload.total = filteredPayload.issues.length;
    return sanitizeIncidents(filteredPayload);
}

function hasService(services: Array<string>, issue: JiraModels.Issue): boolean {
    if (!(issue?.fields) || !services || services.length === 0) {
        return false;
    }
    var issueServices = issue.fields.customfield_14971?.map((a) => a.value) ?? [NONE_TEXT];
    return services.filter(s => issueServices.includes(s)).length > 0;
}

function hasTeam(teams: Array<string>, issue: JiraModels.Issue): boolean {
    if (!(issue?.fields) || !teams || teams.length === 0) {
        return false;
    }
    var issueTeams: Array<string> = [];
    if ((issue.fields.issuelinks?.length ?? 0) === 0) {
        issueTeams.push(NONE_TEXT);
    } else {
        for (var link of issue.fields.issuelinks) {
            if (link?.type?.inward == "is caused by" && link.inwardIssue) {
                issueTeams.push(link.inwardIssue?.fields?.project?.name ?? NONE_TEXT);
            }
        }
        //if the issue had no compatible links then the team is "NONE"
        if (issueTeams.length === 0) {
            issueTeams.push(NONE_TEXT);
        }
    }
    return teams.filter(s => issueTeams.includes(s)).length > 0;
}

function sanitizeIncidents(payload: JiraModels.RootObject): JiraIncidentRootObject {
    if (!payload) {
        return payload;
    }
    if (!payload.issues || payload.total == 0) {
        return payload as JiraIncidentRootObject;
    }

    var totalDetection = 0;
    var totalFix = 0;
    var totalResolution = 0;
    var totalClosure = 0;

    var rootCauses = new NvpArray();
    var statuses = new NvpArray(); //special sort, by order of the steps
    var assignees = new NvpArray();
    statuses.AddToValue("Blocked", 0);
    statuses.AddToValue("To Do", 0);
    statuses.AddToValue("Investigation", 0);
    statuses.AddToValue("Post Mortem Analysis", 0);
    statuses.AddToValue("Follow up", 0);
    statuses.AddToValue("Done", 0);
    statuses.AddToValue("Archive", 0);

    var services = new NvpArray();
    var severities = new NvpArray(); //special sort, and custom not coded, so starting this way
    severities.AddToValue("Critical", 0);
    severities.AddToValue("Major", 0);
    severities.AddToValue("Minor", 0);
    severities.AddToValue("Trivial", 0);
    var teams = new NvpArray();
    var timeline = new Timeline();

    //we want to calculate how many incidents have happened since last week, so first let's consider last week start date
    var lastWeekStartDate = new Date();
    lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7)
    var lastWeek: number = 0;

    for (let issue of payload.issues) {
        if (!issue) {
            continue;
        }

        var incidentDate: Date;

        if (issue.fields.resolutiondate) {
            issue.fields.resolutiondate = new Date(issue.fields.resolutiondate);
        }
        if (issue.fields.customfield_14976) { //detection
            issue.fields.customfield_14976 = new Date(issue.fields.customfield_14976);
        }
        if (issue.fields.customfield_14977) { //resolution
            issue.fields.customfield_14977 = new Date(issue.fields.customfield_14977);
        }
        if (issue.fields.customfield_14871) { //introduction
            incidentDate = issue.fields.customfield_14871 = new Date(issue.fields.customfield_14871);
        } else {
            incidentDate = new Date(issue.fields.created);
        }
        if (issue.fields.customfield_14976 && issue.fields.customfield_14871) {
            issue.fields.timeToDetection = TimeSpan.Subtract(issue.fields.customfield_14871, issue.fields.customfield_14976) ?? undefined;
            totalDetection += Math.abs(issue.fields.timeToDetection?.totalMilliSeconds ?? 0);
        }
        if (issue.fields.customfield_14976 && issue.fields.customfield_14977) {
            issue.fields.timeToFix = TimeSpan.Subtract(issue.fields.customfield_14976, issue.fields.customfield_14977) ?? undefined;
            totalFix += Math.abs(issue.fields.timeToFix?.totalMilliSeconds ?? 0);
        }
        if (issue.fields.customfield_14871 && issue.fields.customfield_14977) {
            issue.fields.timeToResolution = TimeSpan.Subtract(issue.fields.customfield_14871, issue.fields.customfield_14977) ?? undefined;
            totalResolution += Math.abs(issue.fields.timeToResolution?.totalMilliSeconds ?? 0);
        }
        if (issue.fields.customfield_14871 && issue.fields.resolutiondate) {
            issue.fields.timeToClosure = TimeSpan.Subtract(issue.fields.customfield_14871, issue.fields.resolutiondate) ?? undefined;
            totalClosure += Math.abs(issue.fields.timeToClosure?.totalMilliSeconds ?? 0);
        }
        //root cause merge with external reasons: customfield_14918
        //if customfield_14918 is empty or id: 14629 we merge the external reason in the root cause
        if ((!issue.fields.customfield_14918 || issue.fields.customfield_14918.id === "14629") && issue.fields.customfield_14969) {
            issue.fields.customfield_14918 = { value: EXTERNAL_REASON };
        }

        //aggregating information for the charts and display
        rootCauses.AddToValue(issue.fields?.customfield_14918?.value ?? NONE_TEXT, 1);
        //status
        statuses.AddToValue(issue.fields?.status?.name ?? NONE_TEXT, 1);
        //severities = customfield_10201
        severities.AddToValue(issue.fields?.customfield_10201?.value ?? NONE_TEXT, 1);
        //teams are harder, we have a list of linked caused for the incident
        if ((issue.fields.issuelinks?.length ?? 0) === 0) {
            teams.AddToValue(NONE_TEXT, 1);
        } else {
            for (var link of issue.fields.issuelinks) {
                if (link?.type?.inward == "is caused by" && link.inwardIssue) {
                    teams.AddToValue(link.inwardIssue?.fields?.project?.name ?? NONE_TEXT, 1);
                }
            }
        }
        //services are also an array = customfield_14971
        if ((issue.fields?.customfield_14971?.length ?? 0) === 0) {
            services.AddToValue(NONE_TEXT, 1);
        } else {
            for (var service of issue.fields.customfield_14971 ?? []) {
                services.AddToValue(service?.value ?? NONE_TEXT, 1);
            }
        }
        //also the dates for the timeline, it's pretty complex
        //for all the incidents, either they have a introduction date (preferred entry)
        //or they have a creation date (worst case scenario)
        //then everything have a month, but they also have a year, we have a dictionary of years, that contain a nvp array keyed by month
        timeline.Add(incidentDate);

        //last week ?
        if (incidentDate > lastWeekStartDate) {
            lastWeek += 1;
        }

        //assignees
        assignees.AddToValue(issue.fields?.assignee?.displayName ?? NONE_TEXT, 1);
    }

    rootCauses.SortValues();
    teams.SortValues();
    services.SortValues();
    assignees.SortValues();
    //sorting by year
    timeline.series.sort();


    return {
        ...payload,
        totalDetection: new TimeSpan(totalDetection),
        totalFix: new TimeSpan(totalFix),
        totalResolution: new TimeSpan(totalResolution),
        totalClosure: new TimeSpan(totalClosure),
        rootCauses,
        statuses,
        assignees,
        teams,
        services,
        severities,
        timeline,
        lastWeek
    };
}

function InitialiseFilters(root: JiraIncidentRootObject): IncidentsFilters {
    var newFilter = { noFilters: true } as IncidentsFilters;
    if (!root) { return newFilter; }
    console.log(`entering the initialisation of the filters root.rootCauses: ${root.rootCauses}`);
    newFilter.rootCauses = root.rootCauses.GetKeys();
    newFilter.assignees = root.assignees.GetKeys();
    newFilter.services = root.services.GetKeys();
    newFilter.severities = root.severities.GetKeys();
    newFilter.statuses = root.statuses.GetKeys();
    newFilter.teams = root.teams.GetKeys();
    newFilter.years = root.timeline.series;
    return newFilter;
}

function receivedData(response: ElectronResponse, dispatch: (value: any) => void) {
    var cleanResponse = sanitizeIncidents(response.response);
    dispatch(FetchDataSuccess(response.originalRequest, cleanResponse));
    if (!(response.originalRequest.callBackParameters?.isFiltered ?? false)) {
        //I only need to initialize the filter to add the new values as selected by default IF there was no filter
        //if the user had a filter in place then the newly added values will be considered unselected by default
        //so that the selected view does not change too drastically
        dispatch(FiltersUpdated(InitialiseFilters(cleanResponse)));
    }
}

export function FetchData(request: ElectronRequest, isFiltered: boolean = false) {
    console.info(`attempting to fetch data for ${request?.provider}.${request?.contract}`);
    return function (dispatch: Dispatch<any>) {
        // First dispatch: the app state is updated to inform
        // that the API call is starting.  
        dispatch(FetchDataStart(request.parameters, IncidentsCommands.FETCH_DATA));
        if (isFiltered) {
            request.callBackParameters = { isFiltered };
        }
        ClientRequestHandler.sendAsyncMessage(request, (response) => receivedData(response, dispatch));
    }
}

export function UpdateFilters(filterKeys: Array<string>, propertyName: IncidentFilterTypesStrings) {
    return function (dispatch: Dispatch<any>) {
        //we create a new filter object from the provided values
        var newFilter: IncidentsFilters = {} as IncidentsFilters;

        (newFilter as any)[propertyName] = filterKeys;
        newFilter.noFilters = false;

        dispatch(FiltersUpdated(newFilter));
    }
}

export function ResetFilters() {
    return function (dispatch: Dispatch<any>) {
        dispatch(FiltersUpdated(null as unknown as IncidentsFilters, true));
    }
}