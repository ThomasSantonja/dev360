import { ApiContract, RefreshStrategy } from "../main-api";
import { Store } from "../storage/store";
import jiraClient from "jira-connector";
import { JiraModels } from "../models/jira-models";


export class JiraApi implements ApiContract {

    static connection: jiraClient;

    LocalStorage: Store;

    static JIRA_PROVIDER: string = "JIRA";
    static INCIDENTS: string = "getIncidents";

    constructor() {
        this.LocalStorage = new Store(JiraApi.JIRA_PROVIDER);
        if (!JiraApi.connection) {
            try {
                JiraApi.connection = new jiraClient({
                    host: "ssense.atlassian.net",
                    basic_auth: {
                        base64: "dGhvbWFzLnNhbnRvbmphQHNzZW5zZS5jb206eTRmRUhqaHdJVTZ1YzZFZ0hqd2M4N0E3"
                    }
                });
            } catch (problem) {
                //could not create a connection to Jira using those credentials
                throw new Error(`could not create a connection to Jira with the given credentials: ${problem}`);
            }
        }
    }

    async RemoteIncidentAccess(localStorage: Store): Promise<JiraModels.RootObject> {
        try {
            var searchResult = await JiraApi.connection.search.search(
                {
                    jql: "type in (incident) Order by created desc",
                    maxResults: 100
                });
            var searchPayload = <unknown>searchResult as JiraModels.RootObject;
            if ((searchPayload?.issues?.length ?? 0) > 0) {
                for (let ir of searchPayload.issues) {
                    if ((ir?.fields?.issuelinks?.length ?? 0) > 0) {
                        for (let outLink of ir?.fields?.issuelinks) {
                            if (outLink?.type?.inward == "is caused by") {
                                //then we need to request outlink.inwardIssue.self, and add the fields project and assignee to the original issuelink instance so that the consumer can use it
                                //?fields=assignee,project
                                try {
                                    var detailedIssue = await JiraApi.connection.issue.getIssue({
                                        issueKey: outLink.inwardIssue.key,
                                        fields: ["assignee", "project"]
                                    });
                                    //should abstract that addition of properties with a lot of test and safeguards to avoid crashing on undefined ...
                                    outLink.inwardIssue.fields.assignee = detailedIssue.fields.assignee;
                                    outLink.inwardIssue.fields.project = detailedIssue.fields.project;
                                } catch (err) {

                                }
                            }
                        }
                    }
                }
            }
            searchPayload.lastAccessDate = new Date(Date.now());
            localStorage.Update(searchPayload);
        } catch (problem) {
            throw new Error(`unable to perform the request "type in (incident) Order by created desc": ${problem}`);
        }
        return searchPayload;
    }

    async getIncidents(refreshOption: RefreshStrategy = RefreshStrategy.remote_if_no_local): Promise<JiraModels.RootObject> {

        let searchPayload: JiraModels.RootObject;
        let localStorage = new Store(JiraApi.JIRA_PROVIDER + "." + JiraApi.INCIDENTS);

        switch (refreshOption) {
            case RefreshStrategy.only_local:
                searchPayload = localStorage.Read();
                break;
            case RefreshStrategy.force_remote:
                searchPayload = await this.RemoteIncidentAccess(localStorage);
                break;
            case RefreshStrategy.remote_if_no_local:
                searchPayload = localStorage.Read();
                if (!searchPayload) {
                    searchPayload = await this.RemoteIncidentAccess(localStorage);
                }
                break;
        }

        return searchPayload;
    }
}