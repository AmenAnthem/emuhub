const os = require('os');
const loadJsonFile = require('load-json-file');
const childProcess = require('child_process');

var params = new URLSearchParams(window.location.search);

addViewControls();
loadHeader();
loadGames();

function loadGames() {
    var games = loadJsonFile.sync(os.homedir() + '\\emuhub2\\games.json').games;
    for (var gameIndex = 0; gameIndex < games.length; gameIndex++) {
        var currentGame = games[gameIndex];
        var newParams = new URLSearchParams();
        newParams.append('id', params.get('id'));
        newParams.append('romFolderPath', params.get('romFolderPath'));
        var commands = params.getAll('command');
        for (var commandIndex = 0; commandIndex < commands.length; commandIndex++) {
             newParams.append('command', commands[commandIndex]);
        }
        newParams.append('romName', currentGame.romName);
        var link = document.createElement('a');
        link.href = '../commands/commands.html?' + newParams.toString();
        var image = document.createElement('img');
        image.src = os.homedir() + '\\emuhub2\\images\\games\\' + currentGame.romName + 'selection.png';
        link.appendChild(image);
        document.body.appendChild(link);
    }
}

function addViewControls() {
    document.addEventListener('keydown', event => {
        switch (event.key) {
            case 'Escape':
                window.history.back();
                break;
        }
    });
}

function loadHeader() {
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\systems\\' + params.get('id') + 'header.png';
    document.body.appendChild(image);
}