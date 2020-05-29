

export enum MonthName {
    January = "January",
    February = "February",
    March = "March",
    April = "April",
    May = "May",
    June = "June",
    July = "July",
    August = "August",
    September = "September",
    October = "October",
    November = "November",
    December = "December"
}

export default class Timeline {

    entries: Array<TimelineEntry> = new Array<TimelineEntry>();
    series: string[] = [];

    constructor() {
        for (var month of Object.values(MonthName)) {
            this.entries.push({ month: month, values: {} });
        }
    }

    Get(year: string, month: number): number {
        if (this.series.indexOf(year?.toString()) !== -1) {
            return this.entries[month].values[year];
        }
        return 0;
    }

    Add(date: Date, value: number = 1): void {
        if (!date) {
            throw new Error(`invalid (null) date passed`);
        }
        var month = date.getMonth();
        var year = date.getFullYear().toString();
        this._AddImplementation(Object.values(MonthName)[month], year, value);
    }

    private _AddImplementation(month: MonthName, year: string, value: number = 1): void {

        if (this.series.indexOf(year) === -1) {
            //we add the series and the year with 0 item for all month
            this.series.push(year);
            for (var i = 0; i < Object.values(MonthName).length; i++) {
                this.entries[i].values[year] = 0;
            }
        }
        //here we know the year exist with a value, we just need to find the correct line and add the value
        this.entries[Object.values(MonthName).indexOf(month)].values[year] += value;
    }

    ToBasicJs(): Array<{ [key: string]: any }> {
        //we turn our content in basic JS dictionary because it's easier than trying to figure out why the graphic fw do not call a function on key resolution
        var basicJsObject: Array<{ [key: string]: any }> = new Array<{ [key: string]: any }>();
        for (var entry of this.entries) {
            var newEntry: { [key: string]: any } = {};
            newEntry["month"] = entry.month;
            for (var ser in entry.values) {
                newEntry[ser] = entry.values[ser];
            }
            basicJsObject.push(newEntry);
        }
        return basicJsObject;
    }
}

export interface TimelineEntry {
    month: MonthName
    values: { [year: string]: number; }
}