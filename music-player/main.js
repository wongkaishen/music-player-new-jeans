const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 750,
        icon: path.join(__dirname, 'src/assets/icon/newjeans.ico'),
        frame: false,
        transparent: true,
        resizable: false,
        hasShadow: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        backgroundColor: '#00ffffff', // Transparent background
        vibrancy: 'under-window', // Enable vibrancy effect
        visualEffectState: 'active',
    });

    // Set window opacity
    mainWindow.setOpacity(0.98);

    mainWindow.loadFile('index.html');

    // Handle window dragging
    ipcMain.on('drag-window', () => {
        mainWindow.webContents.executeJavaScript(`
            const handleDrag = (e) => {
                window.electronAPI.startDrag();
            };
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', handleDrag);
            }, { once: true });
        `);
    });

    // Add smooth window animations
    mainWindow.on('show', () => {
        mainWindow.setOpacity(0);
        let opacity = 0;
        const fadeIn = setInterval(() => {
            opacity += 0.1;
            if (opacity >= 0.98) {
                opacity = 0.98;
                clearInterval(fadeIn);
            }
            mainWindow.setOpacity(opacity);
        }, 10);
    });

    // Handle close button with fade out animation
    ipcMain.on('close-app', () => {
        let opacity = 0.98;
        const fadeOut = setInterval(() => {
            opacity -= 0.1;
            if (opacity <= 0) {
                clearInterval(fadeOut);
                mainWindow.close();
            }
            mainWindow.setOpacity(opacity);
        }, 10);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
