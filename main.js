const {app, BrowserWindow} = require('electron');

var mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadFile('systems/systems.html');
    mainWindow.on('closed', function () {
        mainWindow = null
    });
    mainWindow.webContents.openDevTools();
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', function () {
    if (mainWindow === null) createWindow();
});