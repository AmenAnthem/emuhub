const {app, BrowserWindow} = require('electron');

var mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width : 1920,
        height : 1080,
        fullscreen : true,
        frame : false,
        resizeable : false,
        movable : false,
        darkTheme : true,
        backgroundColor: '#303030',
        title : 'Emuhub',
        icon : __dirname + '/resources/icon.png',
        webPreferences : {
            nodeIntegration: true
        }
    });
    mainWindow.loadFile('splash/splash.html');
    mainWindow.on('closed', function () {
        mainWindow = null
    });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', function () {
    if (mainWindow === null) createWindow();
});