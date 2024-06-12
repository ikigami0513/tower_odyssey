import { app, BrowserWindow, screen, ipcMain, crashReporter, Tray, Menu, Notification } from 'electron';
import path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { API_BASE_URL } from './settings';
import { format } from 'date-fns';

crashReporter.start({
    productName: "TowerOdyssey",
    submitURL: `${API_BASE_URL}/api/crash_reporter/`
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow: BrowserWindow;

const createWindow = () => {
    // Create the browser window.
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        // fullscreen: true,
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: path.join('resources/icon.png'),
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('close-app', function () {
    const notification = new Notification({
        title: 'Au revoir',
        body: 'À bientôt dans Tower Odyssey.'
    });
    notification.show();

    app.quit();
});

ipcMain.on('capture-screen', async () => {
    if (mainWindow) {
        const image = await mainWindow.capturePage();

        const pictureDir = path.join(os.homedir(), 'Pictures');
        const towerOdysseyDir = path.join(pictureDir, 'TowerOdyssey');

        if (!fs.existsSync(towerOdysseyDir)) {
            fs.mkdirSync(towerOdysseyDir, { recursive: true });
        }

        const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
        const filePath = path.join(towerOdysseyDir, `screenshot_${timestamp}.png`);

        fs.writeFile(filePath, image.toPNG(), (err) => {
            if (err) {
                const notification = new Notification({
                    title: 'Erreur',
                    body: 'La capture d\'écran n\'a pas pu être effectuée.'
                });
                notification.show();
            }
            else {
                const notification = new Notification({
                    title: 'Succès',
                    body: 'La capture d\'écran a bien été effectuée.'
                });
                notification.show();
            }
        });
    }
});

app.whenReady().then(() => {
    const notification = new Notification({
        title: 'Bienvenue',
        body: 'Tower Odyssey s\'est lancé. Bonne aventure.'
    });
    notification.show();

    let tray = new Tray('resources/icon.png');
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Quitter', type: 'normal', click: () => { app.quit(); }}
    ]);
    tray.setToolTip('Tower Odyssey');
    tray.setContextMenu(contextMenu);
});

/*
// Test Crash Reporter
app.whenReady().then(() => {
    // Provoquer un crash après un délai
    setTimeout(() => {
      process.crash(); // Ceci provoquera un crash du processus principal
    }, 5000); // Par exemple, après 5 secondes
});
*/