const remote = require('electron').remote;

showSplash();

function showSplash() {
    setTimeout(() => {
        remote.getCurrentWindow().loadFile('systems/systems.html');
    }, 3000);
}