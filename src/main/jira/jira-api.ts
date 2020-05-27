import { ApiContract, RefreshStrategy } from "../main-api";
import { Store, LocalCache } from "../storage/store";
import jiraClient from "jira-connector";
import { JiraModels } from "../models/jira-models";
import { AvatarUrls } from "jira-connector/types/api";
import { ClientRequest } from "electron";
import bent from "bent";


export class JiraApi implements ApiContract {

    static connection: jiraClient;

    LocalStorage: Store;
    AvatarStorage: Store;
    AvatarCache: LocalCache;

    static JIRA_PROVIDER: string = "JIRA";
    static AVATARS: string = "AVATARS";
    static GET_AVATAR: string = "getAvatar";
    static INCIDENTS: string = "getIncidents";

    constructor() {
        this.LocalStorage = new Store(JiraApi.JIRA_PROVIDER);
        this.AvatarStorage = new Store(JiraApi.JIRA_PROVIDER + "." + JiraApi.AVATARS);
        this.AvatarCache = new LocalCache();


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
                    maxResults: 100,
                    fields: ["issuelinks", "status", "project", "assignee", "resolutiondate", "summary", "created",
                        "customfield_10201", "customfield_14918", "customfield_14976", "customfield_14977", "customfield_14871", "customfield_14971", "customfield_14969"]
                });
            var searchPayload = <unknown>searchResult as JiraModels.RootObject;

            if ((searchPayload?.issues?.length ?? 0) > 0) {

                //let avatarStorage = new Store(JiraApi.JIRA_PROVIDER + "." + JiraApi.AVATARS);

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
                                    //await this.RecoverAvatars(outLink.inwardIssue.fields.project?.avatarUrls);
                                } catch (err) {

                                }
                            }
                        }
                    }
                    //all the avatars of interests for an incident:
                    //the assignee
                    //await this.RecoverAvatars(ir.fields.assignee?.avatarUrls);
                    //the project
                    //await this.RecoverAvatars(ir.fields.project?.avatarUrls);

                }
                //avatarStorage.Update(this.AvatarCache);
            }
            searchPayload.lastAccessDate = new Date(Date.now());
            localStorage.Update(searchPayload);

        } catch (problem) {
            throw new Error(`unable to perform the request "type in (incident) Order by created desc": ${problem}`);
        }
        return searchPayload;
    }

    // async RecoverAvatars(avatarKey: AvatarUrls) {
    //     if (!avatarKey) { return }
    //     try {
    //         var avatar: any;
    //         if (!this.AvatarCache.Get(avatarKey["16x16"])) {
    //             avatar = await this.getBase64Image(avatarKey["16x16"]);
    //             this.AvatarCache.Insert(avatarKey["16x16"], avatar);
    //         }
    //         if (!this.AvatarCache.Get(avatarKey["24x24"])) {
    //             avatar = await this.getBase64Image(avatarKey["24x24"]);
    //             this.AvatarCache.Insert(avatarKey["24x24"], avatar);
    //         }
    //         if (!this.AvatarCache.Get(avatarKey["32x32"])) {
    //             avatar = await this.getBase64Image(avatarKey["32x32"]);
    //             this.AvatarCache.Insert(avatarKey["32x32"], avatar);
    //         }
    //         if (!this.AvatarCache.Get(avatarKey["48x48"])) {
    //             avatar = await this.getBase64Image(avatarKey["48x48"]);
    //             this.AvatarCache.Insert(avatarKey["48x48"], avatar);
    //         }
    //     }
    //     catch (error) {
    //         //just ignoring the avatar recovery failure, less continue the other requests
    //         console.error(`problem when getting avatars`, error);
    //     }
    // }

    async getBase64Image(url: string): Promise<string> {
        try {
            //https://ssense.atlassian.net/secure/projectavatar?size=small&s=small&pid=18802&avatarId=19454
            //https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5e13574561d95d0d9aa62903/cd63d075-4544-428b-bb4b-0142ad4487ba/128?size=16&s=16    
            var urlObject = new URL(url);
            const getStream = bent();
            let stream = await getStream(url) as any;
            if ((stream?.statusCode ?? 0) != 200) {
                return "403"; //likely in a need of JiraAPI suport (but none for avatars yet)
            }
            const obj = await stream.arrayBuffer();
            return `data:${stream.headers['content-type']};base64,${Buffer.from(String.fromCharCode(...new Uint8Array(obj)), 'binary').toString('base64')}`;
        } catch (err) {
            console.error(`while trying to request an image: ${url}`, err);
            return "403";
        }
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

    static unavailableIcon24 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBRsONzcs3YTrAAAAm0lEQVQ4y5WUOw7CMBAFx0hUIbkaHYfMCVIRkDAHQvROAZLlrPcTFy6smbX9tNrEncSVD/6amLnASiEzBfBMYYGBB4W3oww8K+UrDe4rAreVLq4rv1MlFKmYuFRcvFVCOMBIppD/++jh9Ral+skQU6T64SfVr4Z6rE3GVWSQptLPXVXUFusrOt5VbFwoPr5TlmNDIPHiyy08Zs4bJ6hyatGqhawAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDUtMjdUMTQ6NTU6NTUrMDA6MDDLw07fAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTA1LTI3VDE0OjU1OjU1KzAwOjAwup72YwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=";

    async getAvatar(key: string): Promise<string> {
        var avatar: string | undefined = undefined;
        if (!this.AvatarCache || this.AvatarCache.length === 0) {
            var localContent = this.AvatarStorage.Read();
            if (localContent) {
                this.AvatarCache = new LocalCache(localContent.content);
            } else {
                this.AvatarCache = new LocalCache();
            }
        }

        avatar = this.AvatarCache?.Get(key) ?? undefined;

        if (!avatar) {
            //we request directly and then save it in the file
            avatar = await this.getBase64Image(key);
            if (avatar === "403") {
                //we failed, so we use a default icon
                avatar = JiraApi.unavailableIcon24;
            }
            this.AvatarCache.Insert(key, avatar);
            this.AvatarStorage.Update(this.AvatarCache);
        }
        return avatar ?? "unavailable";
    }
}