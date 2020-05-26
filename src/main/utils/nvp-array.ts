export interface NameValuePair {
    name: string;
    value: number;
}

export class NvpArray {

    content: Array<NameValuePair> = new Array<NameValuePair>();

    private _comparator: (left: number, right: number) => number = NvpArray.NUMBER_DESC_COMPARATOR;

    static NUMBER_ASC_COMPARATOR(left: number, right: number): number {
        if (!left || !right) { return 0; }
        if (left < right) { return -1; }
        if (left == right) { return 0; }
        if (left > right) { return 1; }
        return 0;
    }

    static NUMBER_DESC_COMPARATOR(left: number, right: number): number {
        if (!left || !right) { return 0; }
        if (left > right) { return -1; }
        if (left == right) { return 0; }
        if (left < right) { return 1; }
        return 0;
    }

    static STRING_DESC_COMPARATOR(left: string, right: string): number {
        if (!left || !right) { return 0; }
        return left.localeCompare(right);
    }

    static STRING_ASC_COMPARATOR(left: string, right: string): number {
        if (!left || !right) { return 0; }
        return left.localeCompare(right) * -1;
    }

    //insert the name with its value if the name was not present
    //add the value to the corresponding name if already present
    //return the new value
    AddToValue(name: string, value: number): number {
        //finding out if the object exist
        var nvp = this.Get(name);
        if (nvp == null) {
            nvp = { name, value };
            this.content.push(nvp);
        }
        else {
            nvp.value += value;
        }
        return nvp.value;
    }

    //get the key value pair for the given key
    Get(name: string): NameValuePair {
        for (var k of this.content) {
            if (k.name === name) {
                return k;
            }
        }
        return null as unknown as NameValuePair;
    }

    GetValue(name: string): number {
        for (var k of this.content) {
            if (k.name === name) {
                return k.value;
            }
        }
        return Number.NaN;
    }

    ToArray(): Array<NameValuePair> {
        return this.content;
    }

    private _partition(left: number = 0, right: number = this.content.length - 1): number {
        const pivot = this.content[Math.floor((right + left) / 2)];
        let i = left;
        let j = right;

        while (i <= j) {
            //same as array[i].value < pivot.value
            while (this._comparator(this.content[i].value, pivot.value) < 0) {
                i++;
            }

            //same as array[i].value > pivot.value
            while (this._comparator(this.content[j].value, pivot.value) > 0) {
                j--;
            }

            if (i <= j) {
                [this.content[i], this.content[j]] = [this.content[j], this.content[i]];
                i++;
                j--;
            }
        }
        return i;
    }

    //will need to change in order to support sorting on the names (for now only values and only asc)
    SortValues(comparator: (left: number, right: number) => number = NvpArray.NUMBER_DESC_COMPARATOR) {
        this._comparator = comparator;
        this._internalSortValues(0, this.content.length - 1);
    }

    private _internalSortValues(left: number, right: number) {
        let index;

        if (this.content.length > 1) {

            index = this._partition(left, right);

            if (left < index - 1) {
                this._internalSortValues(left, index - 1);
            }

            if (index < right) {
                this._internalSortValues(index, right);
            }
        }
    }
}
