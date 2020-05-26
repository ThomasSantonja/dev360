import { Command } from "../store";
import { JiraModels } from "../../../main/models/jira-models";
import { RefreshStrategy } from "../../../main/main-api";
import { ElectronRequest, ElectronResponse } from "../../../main/models/app-api-payload";
import { Dispatch } from "react";
import { ClientRequestHandler } from "../../../renderer/data/clientRequestHandler";
import { TimeSpan } from "../../../main/utils/timespan";
import { NvpArray } from "../../../main/utils/nvp-array";

export interface IncidentsState {
    payload: JiraIncidentRootObject;
    filters: any;
    isFetching: boolean;
    hasFetched: boolean;
    lastUpdate?: Date;
    increasedPayload: number;
};

const defaultIncidentsState: IncidentsState = {
    payload: null as unknown as JiraIncidentRootObject,
    filters: null,
    hasFetched: false,
    isFetching: false,
    increasedPayload: 0
};

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
    severities: NvpArray
}

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
    FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCES',
}

const NONE_TEXT = "None";
const EXTERNAL_REASON = "External reason";

export function FetchDataStart(dataAccess: RefreshStrategy): FetchDataCommand {
    return { type: IncidentsCommands.FETCH_DATA, dataAccess };
}

export function FetchDataSuccess(originalRequest: ElectronRequest, payload: JiraModels.RootObject): FetchDataSuccessCommand {
    return { type: IncidentsCommands.FETCH_DATA_SUCCESS, originalRequest, payload };
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
            var increase = (fetchSuccessAction.payload?.total ?? 0) - (state.payload?.total ?? 0);
            return Object.assign<{}, IncidentsState, IncidentsState>(
                {},
                state,
                {
                    isFetching: false,
                    hasFetched: true,
                    lastUpdate: fetchSuccessAction.payload?.lastAccessDate,
                    payload: fetchSuccessAction.payload,
                    increasedPayload: increase
                } as IncidentsState);
        default:
            return state
    }
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

    for (let issue of payload.issues) {
        if (!issue) {
            continue;
        }

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
            issue.fields.customfield_14871 = new Date(issue.fields.customfield_14871);
        }
        if (issue.fields.customfield_14976 && issue.fields.customfield_14871) {
            issue.fields.timeToDetection = TimeSpan.Subtract(issue.fields.customfield_14871, issue.fields.customfield_14976) ?? undefined;
            totalDetection += issue.fields.timeToDetection?.totalMilliSeconds ?? 0;
        }
        if (issue.fields.customfield_14976 && issue.fields.customfield_14977) {
            issue.fields.timeToFix = TimeSpan.Subtract(issue.fields.customfield_14976, issue.fields.customfield_14977) ?? undefined;
            totalFix += issue.fields.timeToFix?.totalMilliSeconds ?? 0;
        }
        if (issue.fields.customfield_14871 && issue.fields.customfield_14977) {
            issue.fields.timeToResolution = TimeSpan.Subtract(issue.fields.customfield_14871, issue.fields.customfield_14977) ?? undefined;
            totalResolution += issue.fields.timeToResolution?.totalMilliSeconds ?? 0;
        }
        if (issue.fields.customfield_14871 && issue.fields.resolutiondate) {
            issue.fields.timeToClosure = TimeSpan.Subtract(issue.fields.customfield_14871, issue.fields.resolutiondate) ?? undefined;
            totalClosure += issue.fields.timeToClosure?.totalMilliSeconds ?? 0;
        }
        //root cause merge with external reasons: customfield_14918
        //if customfield_14918 is empty or id: 14629 we merge the external reason in the root cause
        if ((!issue.fields.customfield_14918 || issue.fields.customfield_14918.id === "14629") && issue.fields.customfield_14969) {
            issue.fields.customfield_14918 = { value: EXTERNAL_REASON };
        }

        //aggregating information for the charts and display
        //14971 = services
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

        //error management on dates (for later)
        // if (rd.closureDate && rd.detectionDate && rd.detectionDate > rd.closureDate) {
        //     rd.errors.push(`The close date: ${rd.closureDate} is inferior to the detection date: ${rd.detectionDate}, likely an input error`);
        // }
        // if (rd.closureDate && rd.introductionDate) {
        //     if (rd.introductionDate > rd.closureDate) {
        //         rd.errors.push(`The close date: ${rd.closureDate} is inferior to the introduction date: ${rd.introductionDate}, likely an input error`);
        //     }
        //     else {
        //         rd.timesToClosure = TimeSpan.Subtract(rd.introductionDate, rd.closureDate).totalMilliSeconds;
        //     }
        // }
        // if (rd.detectionDate && rd.introductionDate)
        //     if (rd.introductionDate > rd.detectionDate) {
        //         rd.errors.push(`The detection date: ${rd.detectionDate} is inferior to the introduction date: ${rd.introductionDate}, likely an input error`);
        //     } else {
        //         rd.timesToDetection = TimeSpan.Subtract(rd.introductionDate, rd.detectionDate).totalMilliSeconds;
        //     }
        // if (rd.detectionDate && rd.resolutionDate) {
        //     if (rd.detectionDate > rd.resolutionDate) {
        //         rd.errors.push(`The resolution date: ${rd.resolutionDate} is inferior to the detection date: ${rd.detectionDate}, likely an input error`);
        //     } else {
        //         rd.timesToFix = TimeSpan.Subtract(rd.detectionDate, rd.resolutionDate).totalMilliSeconds;
        //     }
        // }
        // if (rd.introductionDate && rd.resolutionDate) {
        //     if (rd.introductionDate > rd.resolutionDate) {
        //         rd.errors.push(`The resolutionDate date: ${rd.resolutionDate} is inferior to the introduction date: ${rd.introductionDate}, likely an input error`);
        //     } else {
        //         rd.timesToResolution = TimeSpan.Subtract(rd.introductionDate, rd.resolutionDate).totalMilliSeconds;
        //     }
        // }
    }

    rootCauses.SortValues();
    //statuses.SortValues();
    teams.SortValues();
    services.SortValues();
    //severities.SortValues();

    return {
        ...payload,
        totalDetection: new TimeSpan(totalDetection),
        totalFix: new TimeSpan(totalFix),
        totalResolution: new TimeSpan(totalResolution),
        totalClosure: new TimeSpan(totalClosure),
        rootCauses,
        statuses,
        teams,
        services,
        severities
    };
}

export function FetchData(request: ElectronRequest) {
    console.info(`attempting to fetch data for ${request?.provider}.${request?.contract}`);
    return function (dispatch: Dispatch<any>) {
        // First dispatch: the app state is updated to inform
        // that the API call is starting.  
        dispatch(FetchDataStart(request.parameters))

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.  
        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.
        ClientRequestHandler.sendAsyncMessage(request, (response: ElectronResponse) => {
            response.response = sanitizeIncidents(response.response);
            dispatch(FetchDataSuccess(response.originalRequest, response.response));
        });
    }
}