const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 750,
        icon: path.join(__dirname, 'src/assets/icon/newjeans.ico'),
        frame: false,  // Removes the default frame (frameless window)
        transparent: true, // Optional: Makes the window transparent
        resizable: false, // Prevent resizing
        webPreferences: {
            nodeIntegration: true,  // Allows communication with Renderer process
            contextIsolation: false, 
        }
    });

    mainWindow.loadFile('index.html');

    ipcMain.on('close-app', () => {
        app.quit();
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
});
