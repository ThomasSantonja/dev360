

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

    static FilteredPropName = "filtered";

    /**
     * Return the basic JS object of the current timeline (optimised for graphs framework) filtered with the timelineFiltered passed as parameter.
     * What this means is that, the current timeline, for all the shared time entries, will be reduced by the corresponding value of the filtered timeline
     * so that both can be stacked from the same data source
     * @param timelineFiltered the filtered timeline on which to alter this instance to get a stacked result
     * @returns the basic JS object of the current timeline and the filtered one, the filtered one use "filtered" in front of the name of the property containing its value
     */
    FilterWith(timelineFiltered: Timeline): Array<{ [key: string]: any }> {
        if (!timelineFiltered) {
            return undefined as unknown as Array<{ [key: string]: any }>;
        }
        if (timelineFiltered.entries.length !== this.entries.length) {
            //wrong timeline, likely corrupted, returning empty again
            return undefined as unknown as Array<{ [key: string]: any }>;
        }
        var merged = new Timeline();
        //now for all the created information in the basic Js Object, we find the corresponding entry in the filter and remove the same value while adding the filtered one
        for (var monthId = 0; monthId < Object.values(MonthName).length; monthId++) {
            //do we have the same in the filtered timeline ?
            for (var series in this.entries[monthId].values) {
                merged.entries[monthId].values[series] = this.entries[monthId].values[series];
                var filterSeries = timelineFiltered.entries[monthId].values[series];
                if (filterSeries && filterSeries > 0) {
                    merged.entries[monthId].values[series] -= filterSeries;
                    merged.entries[monthId].values[Timeline.FilteredPropName + "-" + series] = filterSeries;
                }
            }
        }
        return merged.ToBasicJs();
    }
}

export interface TimelineEntry {
    month: MonthName
    values: { [year: string]: number; }
}