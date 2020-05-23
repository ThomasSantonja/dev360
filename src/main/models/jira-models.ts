export module JiraModels {

    export interface Type {
        id: string;
        name: string;
        inward: string;
        outward: string;
        self: string;
    }

    export interface StatusCategory {
        self: string;
        id: number;
        key: string;
        colorName: string;
        name: string;
    }

    export interface Status {
        self: string;
        description: string;
        iconUrl: string;
        name: string;
        id: string;
        statusCategory: StatusCategory;
    }

    export interface Priority {
        self: string;
        iconUrl: string;
        name: string;
        id: string;
    }

    export interface Issuetype {
        self: string;
        id: string;
        description: string;
        iconUrl: string;
        name: string;
        subtask: boolean;
        avatarId: number;
    }

    export interface Issuelink {
        id: string;
        self: string;
        type: Type;
        outwardIssue: Issue;
        inwardIssue: Issue;
    }

    // export interface AvatarUrls {
    //     48x48: string;
    //     24x24: string;
    //     16x16: string;
    //     32x32: string;
    // }

    export interface Assignee {
        self: string;
        accountId: string;
        avatarUrls: any;
        displayName: string;
        active: boolean;
        timeZone: string;
        accountType: string;
    }

    export interface Reporter {
        self: string;
        accountId: string;
        emailAddress: string;
        avatarUrls: any;
        displayName: string;
        active: boolean;
        timeZone: string;
        accountType: string;
    }

    export interface NonEditableReason {
        reason: string;
        message: string;
    }

    export interface Customfield14885 {
        hasEpicLinkFieldDependency: boolean;
        showField: boolean;
        nonEditableReason: NonEditableReason;
    }

    export interface Progress {
        progress: number;
        total: number;
    }

    export interface Votes {
        self: string;
        votes: number;
        hasVoted: boolean;
    }
   
    export interface ProjectCategory {
        self: string;
        id: string;
        description: string;
        name: string;
    }

    export interface Project {
        self: string;
        id: string;
        key: string;
        name: string;
        projectTypeKey: string;
        simplified: boolean;
        avatarUrls: any;
        projectCategory: ProjectCategory;
    }

    export interface Mark {
        type: string;
    }

    export interface Attrs {
        id: string;
        type: string;
        collection: string;
        level: number;
        isNumberColumnEnabled?: boolean;
        layout: string;
        color: string;
        panelType: string;
    }

    export interface Content {
        type: string;
        text: string;
        marks: Mark[];
        attrs: Attrs;
        content: Content[];
    }   

    export interface Customfield14867 {
        version: number;
        type: string;
        content: Content[];
    }

    export interface Watches {
        self: string;
        watchCount: number;
        isWatching: boolean;
    }

    export interface Customfield14982 {
        version: number;
        type: string;
        content: Content[];
    }    

    export interface Customfield14983 {
        version: number;
        type: string;
        content: Content[];
    }

    export interface Customfield14981 {
        version: number;
        type: string;
        content: Content[];
    }

    export interface Description {
        version: number;
        type: string;
        content: Content[];
    }

    export interface Customfield14967 {
        self: string;
        accountId: string;
        avatarUrls: any;
        displayName: string;
        active: boolean;
        timeZone: string;
        accountType: string;
    }

    export interface I18nErrorMessage {
        i18nKey: string;
        parameters: any[];
    }

    export interface Customfield11204 {
        errorMessage: string;
        i18nErrorMessage: I18nErrorMessage;
    }

    export interface Customfield11205 {
        errorMessage: string;
        i18nErrorMessage: I18nErrorMessage;
    }

    export interface Customfield14838 {
        self: string;
        value: string;
        id: string;
    }

    export interface Customfield14821 {
        self: string;
        value: string;
        id: string;
    }

    export interface Status2 {
        self: string;
        description: string;
        iconUrl: string;
        name: string;
        id: string;
        statusCategory: StatusCategory;
    }

    export interface Customfield14932 {
        version: number;
        type: string;
        content: Content[];
    }
   
    export interface Creator {
        self: string;
        accountId: string;
        emailAddress: string;
        avatarUrls: any;
        displayName: string;
        active: boolean;
        timeZone: string;
        accountType: string;
    }

    export interface Aggregateprogress {
        progress: number;
        total: number;
    }

    export interface Customfield13711 {
        self: string;
        value: string;
        id: string;
    }

    export interface Customfield10201 {
        self: string;
        value: string;
        id: string;
    }

    export interface Customfield11405 {
        version: number;
        type: string;
        content: Content[];
    }

    export interface Customfield13000 {
        hasEpicLinkFieldDependency: boolean;
        showField: boolean;
        nonEditableReason: NonEditableReason;
    }

    export interface Customfield14852 {
        version: number;
        type: string;
        content: Content[];
    }

    export interface Fields {
        customfield_13100: string;
        resolution?: any;
        customfield_12800?: any;
        customfield_10501?: any;
        customfield_12801?: any;
        customfield_14307?: any;
        lastViewed: Date;
        customfield_14300?: any;
        customfield_12001?: any;
        customfield_12003?: any;
        customfield_14302?: any;
        customfield_12005?: any;
        labels: any[];
        aggregatetimeoriginalestimate?: any;
        issuelinks: Issuelink[];
        assignee: Assignee;
        components: any[];
        customfield_14411?: any;
        customfield_13200?: any;
        customfield_14412?: any;
        customfield_14405?: any;
        customfield_14406?: any;
        customfield_12900?: any;
        subtasks: any[];
        customfield_14880?: any;
        reporter: Reporter;
        customfield_12101?: any;
        customfield_14881?: any;
        customfield_12100?: any;
        customfield_14887?: any;
        customfield_14403?: any;
        customfield_14404?: any;
        customfield_14885: Customfield14885;
        customfield_14402?: any;
        customfield_11008?: any;
        customfield_14879?: any;
        customfield_11009?: any;
        progress: Progress;
        votes: Votes;
        issuetype: Issuetype;
        customfield_14872?: any;
        project: Project;
        customfield_14870?: any;
        customfield_13300?: any;
        customfield_14871?: any;
        customfield_11001?: any;
        customfield_14876?: any;
        customfield_11003?: any;
        customfield_11005?: any;
        customfield_14875?: any;
        customfield_14869?: any;
        customfield_12206?: any;
        customfield_12205?: any;
        customfield_10700?: any;
        customfield_12208?: any;
        customfield_14867: Customfield14867;
        customfield_12207?: any;
        customfield_10701?: any;
        customfield_10702?: any;
        customfield_10703?: any;
        customfield_10704?: any;
        resolutiondate?: any;
        customfield_10705?: any;
        watches: Watches;
        customfield_14861?: any;
        customfield_14982: Customfield14982;
        customfield_14983: Customfield14983;
        customfield_14862?: any;
        customfield_14980?: any;
        customfield_12200?: any;
        customfield_14981: Customfield14981;
        customfield_14860?: any;
        customfield_12202?: any;
        customfield_14986?: any;
        customfield_14865?: any;
        customfield_14866?: any;
        customfield_12201?: any;
        customfield_10024?: any;
        customfield_14863?: any;
        customfield_12204?: any;
        customfield_14864?: any;
        customfield_12203?: any;
        customfield_14979?: any;
        customfield_14859?: any;
        customfield_14977?: any;
        customfield_11900?: any;
        customfield_14856?: any;
        customfield_14978?: any;
        customfield_14857?: any;
        updated: Date;
        timeoriginalestimate?: any;
        customfield_14850?: any;
        customfield_14971?: any;
        customfield_14972?: any;
        customfield_14851?: any;
        description: Description;
        customfield_11100?: any;
        customfield_14970?: any;
        customfield_14975?: any;
        customfield_14855?: any;
        customfield_13400?: any;
        customfield_14976: Date;
        customfield_14852: Customfield14852;
        customfield_14853?: any;
        customfield_14974?: any;
        customfield_14969?: any;
        customfield_14848?: any;
        customfield_14966?: any;
        customfield_10007: string[];
        customfield_14967: Customfield14967[];
        customfield_10008?: any;
        customfield_14846?: any;
        customfield_10800?: any;
        summary: string;
        customfield_14840?: any;
        customfield_14961?: any;
        customfield_10000?: any;
        customfield_14601?: any;
        customfield_14964?: any;
        customfield_10001: Date;
        customfield_14843?: any;
        customfield_12301?: any;
        customfield_10002?: any;
        customfield_14965?: any;
        customfield_12300?: any;
        customfield_14844?: any;
        customfield_14602?: any;
        customfield_14962?: any;
        customfield_10003?: any;
        customfield_14841?: any;
        customfield_14600?: any;
        customfield_14963?: any;
        customfield_14842?: any;
        customfield_14836?: any;
        customfield_11204: Customfield11204;
        customfield_11205: Customfield11205;
        customfield_14837?: any;
        environment?: any;
        customfield_14834?: any;
        customfield_14835?: any;
        duedate?: any;
        customfield_14838: Customfield14838;
        customfield_14839?: any;
        statuscategorychangedate: Date;
        customfield_14950?: any;
        customfield_11320?: any;
        fixVersions: any[];
        customfield_13500?: any;
        customfield_11200?: any;
        customfield_14832?: any;
        customfield_11321?: any;
        customfield_11201: any[];
        customfield_11322?: any;
        customfield_14833?: any;
        customfield_14830?: any;
        customfield_14951?: any;
        customfield_11202?: any;
        customfield_11203?: any;
        customfield_14831?: any;
        customfield_14952?: any;
        customfield_14946?: any;
        customfield_11314?: any;
        customfield_11315?: any;
        customfield_14826?: any;
        customfield_14944?: any;
        customfield_14823?: any;
        customfield_11316?: any;
        customfield_11317?: any;
        customfield_14945?: any;
        customfield_14824?: any;
        customfield_14829?: any;
        customfield_11318?: any;
        customfield_11319?: any;
        customfield_14948?: any;
        customfield_14827?: any;
        customfield_14828?: any;
        customfield_14949?: any;
        customfield_14942?: any;
        customfield_12400?: any;
        customfield_11310?: any;
        priority: Priority;
        customfield_14821: Customfield14821;
        customfield_11311?: any;
        customfield_14943?: any;
        customfield_14822?: any;
        customfield_11312?: any;
        customfield_14940?: any;
        customfield_14820?: any;
        customfield_11313?: any;
        customfield_14941?: any;
        customfield_14814?: any;
        customfield_14815?: any;
        customfield_11304?: any;
        customfield_11305?: any;
        customfield_11306?: any;
        customfield_14934?: any;
        customfield_14813?: any;
        customfield_14818?: any;
        customfield_14939?: any;
        timeestimate?: any;
        versions: any[];
        customfield_11308?: any;
        customfield_14819?: any;
        customfield_14816?: any;
        customfield_11309?: any;
        customfield_14817?: any;
        customfield_14938?: any;
        status: Status2;
        customfield_14810?: any;
        customfield_14811?: any;
        customfield_11300?: any;
        customfield_14932: Customfield14932;
        customfield_11301?: any;
        customfield_11302?: any;
        customfield_14803?: any;
        customfield_14804?: any;
        customfield_14807?: any;
        customfield_14928?: any;
        aggregatetimeestimate?: any;
        customfield_14808?: any;
        customfield_14929?: any;
        customfield_14805?: any;
        customfield_14806?: any;
        customfield_14809?: any;
        creator: Creator;
        customfield_14001?: any;
        aggregateprogress: Aggregateprogress;
        customfield_14800?: any;
        customfield_13711: Customfield13711;
        customfield_10201: Customfield10201;
        customfield_13710?: any;
        customfield_11524?: any;
        customfield_11523?: any;
        customfield_11405: Customfield11405;
        customfield_11525?: any;
        customfield_13703?: any;
        customfield_13705?: any;
        customfield_14918?: any;
        customfield_13708?: any;
        customfield_13707?: any;
        customfield_13709?: any;
        timespent?: any;
        customfield_11520?: any;
        aggregatetimespent?: any;
        customfield_11522?: any;
        customfield_11513?: any;
        customfield_11512?: any;
        customfield_14903?: any;
        customfield_11515?: any;
        customfield_11516?: any;
        customfield_11519?: any;
        customfield_11518?: any;
        workratio: number;
        customfield_14909?: any;
        created: Date;
        customfield_11511?: any;
        customfield_10300: string;
        customfield_12600?: any;
        customfield_11510?: any;
        customfield_13800?: any;
        customfield_11503?: any;
        customfield_11506?: any;
        customfield_11505?: any;
        customfield_11507?: any;
        customfield_11509?: any;
        customfield_13000: Customfield13000;
        customfield_10401?: any;
        customfield_10402?: any;
        customfield_12700?: any;
        security?: any;
        customfield_10400?: any;
        customfield_11601?: any;
        customfield_13900?: any;
        customfield_11603?: any;
        customfield_11602?: any;
        customfield_11605?: any;
        customfield_11604?: any;
        customfield_11606?: any;
    }

    export interface Issue {
        expand: string;
        id: string;
        self: string;
        key: string;
        fields: Fields;
    }

    export interface RootObject {
        expand: string;
        startAt: number;
        maxResults: number;
        total: number;
        issues: Issue[];
        lastAccessDate: Date;
    }

}

