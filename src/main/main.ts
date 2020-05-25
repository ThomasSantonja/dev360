import { app, BrowserWindow, BrowserWindowConstructorOptions, Menu } from "electron";
import MainApi from "./main-api";
import { Store } from "./storage/store";
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

//installable prod version command line:
//npm run dist
export default class Main {

    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow: typeof BrowserWindow;
    static appStore: Store;
    static APP_STORE_NAME: string = "dev360.app";
    static api: MainApi;

    /*
     * Windows event handlers
     */

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClosed() {
        // Dereference the window object. // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
        Main.mainWindow = null as unknown as BrowserWindow;
    }

    private static onClose() {
        try {
            var pos = Main.mainWindow.getPosition();
            var size = Main.mainWindow.getSize();
            var state: BrowserWindowConstructorOptions = {
                width: size[0],
                height: size[1],
                x: pos[0],
                y: pos[1]
            };
            Main.appStore.Update(state);
        } catch (error) {
            //next load will likely be default
        }
    }

    private static onReady() {

        let state: BrowserWindowConstructorOptions = {};
        try {
            state = Main.appStore.Read() ?? { width: 800, height: 600 };

        } catch (error) {

        }

        state.webPreferences = {
            nodeIntegration: true
        };
        state.show = false;

        Main.mainWindow = new BrowserWindow(state);

        Menu.setApplicationMenu(null);

        Main.mainWindow.on('close', Main.onClose);
        Main.mainWindow.on('closed', Main.onClosed);

        Main.mainWindow.webContents.on('did-finish-load', Main.onReadyToShow);

        // and load the index.html of the app.
        // if (process.env.NODE_ENV !== 'production') {
        //     process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'; // eslint-disable-line require-atomic-updates
        //     Main.mainWindow.loadURL(`http://localhost:2003`);
        // } else {
        //     Main.mainWindow.loadURL(
        //         url.format({
        //             pathname: path.join(__dirname, 'index.html'),
        //             protocol: 'file:',
        //             slashes: true
        //         })
        //     );
        // }        
        Main.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        //dev tools in debug mode
        Main.mainWindow.webContents.openDevTools();

    }

    private static onReadyToShow() {
        Main.mainWindow.show();
    }

    private static onActivate() {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            this.onReady();
        }
    }

    /*
     * Application methods
     */

    private static async installExtensions() {
        // const installer = require('electron-devtools-installer');
        // const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
        // const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

        // return Promise.all(
        //     extensions.map(name => installer.default(installer[name], forceDownload))
        // ).catch(console.log); // eslint-disable-line no-console
    }

    static async start(app: Electron.App, browserWindow: typeof BrowserWindow) {
        console.info(`starting the main application`);
        try {
            if (process.env.NODE_ENV !== 'production') {
                await Main.installExtensions();
            }

            Main.BrowserWindow = browserWindow;
            Main.application = app;
            Main.application.on('window-all-closed', Main.onWindowAllClosed);

            Main.application.on('ready', Main.onReady);
            Main.application.on('activate', Main.onActivate);

            Main.appStore = new Store(Main.APP_STORE_NAME);
            Main.api = new MainApi();
        } catch (error) {
            //unable to load the application
        }
    }
}

Main.start(app, BrowserWindow);