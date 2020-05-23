export interface KeyValuePair<T> {
    key: string;
    value: T;
}

export class Dictionary<T> {

    content: Array<KeyValuePair<T>> = new Array<KeyValuePair<T>>();

    private _comparator: (left: T, right: T) => number = (left: T, right: T) => {
        if (!left || !right) { return 0; }
        if (left > right) { return -1; }
        if (left == right) { return 0; }
        if (left < right) { return 1; }        
        return 0;
    }

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

    //add or replace the value if present
    Insert(key: string, value: T) {
        var kvp = this.Get(key);
        if (kvp) {
            kvp.value = value;
        }
        else {
            this.content.push({ key, value });
        }
    }

    //get the key value pair for the given key
    Get(key: string): KeyValuePair<T> {
        for (var k of this.content) {
            if (k.key === key) {
                return k;
            }
        }
        return null as unknown as KeyValuePair<T>;
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

    SortValues(comparator: (left: T, right: T) => number = null as unknown as (left: T, right: T) => number) {
        if (comparator && comparator != this._comparator) {
            this._comparator = comparator;
        }
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

    GetKeys(): Array<string> {
        if (!this.content) { return null as unknown as string[]; }
        var newArray = new Array<string>();
        for (let kvp of this.content) {
            newArray.push(kvp.key);
        }
        return newArray;
    }

    GetValues(): Array<T> {
        if (!this.content) { return null as unknown as T[]; }
        var newArray = new Array<T>();
        for (let kvp of this.content) {
            newArray.push(kvp.value);
        }
        return newArray;
    }
}
