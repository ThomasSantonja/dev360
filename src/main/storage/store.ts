import * as path from 'path';
import * as fs from "fs";
import * as electron from "electron";

export class Store {

    path: string;
    static STORE_FILE_EXTENSION: string = '.json';

    constructor(storeName: string) {
        // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
        // app.getPath('userData') will return a string of the user's app data directory path.
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
        this.path = path.join(userDataPath, storeName + Store.STORE_FILE_EXTENSION);
    }

    // This will just return the property on the `data` object
    Read(): any {
        try {
            if (fs.existsSync(this.path)) {
                //file exists
                return JSON.parse(fs.readFileSync(this.path, "utf8"));
            }
        } catch (error) {
            // if there was some kind of error, return the passed in defaults instead.
            return null;
        }
        return null;
    }

    // ...and this will set it
    Update(document: any) {
        try {
            fs.writeFileSync(this.path, JSON.stringify(document));
        } catch (error) {

        }
    }
}