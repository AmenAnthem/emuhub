const remote = require('electron').remote;
const os = require('os');
const loadJsonFile = require('load-json-file');

addViewControls();
loadSystems();

function loadSystems() {
    var systems = loadJsonFile.sync(os.homedir() + '\\emuhub2\\systems.json').systems;
    for (var systemIndex = 0; systemIndex < systems.length; systemIndex++) {
        var currentSystem = systems[systemIndex];
        var newParams = new URLSearchParams();
        newParams.append('id', currentSystem.id);
        newParams.append('romFolderPath', currentSystem.romFolderPath);
        var currentCommands = currentSystem.commands;
        for (var commandIndex = 0; commandIndex < currentCommands.length; commandIndex++) {
            newParams.append('command', currentCommands[commandIndex].command);
        }
        var link = document.createElement('a');
        link.href = '../games/games.html?' + newParams.toString();
        var image = document.createElement('img');
        image.src = os.homedir() + '\\emuhub2\\images\\systems\\' + currentSystem.id + 'selection.png';
        link.appendChild(image);
        document.body.appendChild(link);
    }
}

function addViewControls() {
    document.addEventListener('keydown', event => {
        switch (event.key) {
            case 'Escape':
                remote.getCurrentWindow().close();
                break;
        }
    });
}