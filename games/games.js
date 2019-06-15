const os = require('os');
const loadJsonFile = require('load-json-file');
const childProcess = require('child_process');
const params = new URLSearchParams(window.location.search);
const systemId = params.get('systemId');
const games = loadGames();
const lastButtonMaxCycles = 5;

var focusedGameIndex = 0;
var lastButtonIndex = null;
var lastButtonCycles = 0;

addViewControls();
addHeader();
addGames();

function loadGames() {
    return loadJsonFile.sync(os.homedir() + '\\emuhub2\\games\\' + systemId + '\\games.json').games;
}

function addGames() {
    for (var i = 0; i < games.length; i++) {
        addGame(games[i]);
    }
}

function addGame(game) {
    var newParams = new URLSearchParams();
    newParams.append('systemId', systemId);
    newParams.append('file', game.file);
    var link = document.createElement('a');
    link.id = game.name;
    link.href = '../commands/commands.html?' + newParams.toString();
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\games\\' + game.file + 'selection.png';
    link.appendChild(image);
    document.body.appendChild(link);
}

function addHeader() {
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\systems\\' + systemId + 'header.png';
    document.body.appendChild(image);
}

function addViewControls() {
    document.addEventListener('keydown', event => {
            switch (event.key) {
                case 'Escape':
                    window.history.back();
                    break;
            }
        });
    window.addEventListener('gamepadconnected', function(event) {
        if (event.gamepad.index === 0) {
            addGamepadPolling();
        }
    });
}

function addGamepadPolling() {
    pollingInterval = setInterval(Gamepad.poll, 50);
}

var GamepadControls = {
    confirm : function() {
        document.getElementById(games[focusedGameIndex].name).click();
    },

    cancel : function() {
        window.history.back();
    },

    left : function() {
        focusedGameIndex--;
    },

    right : function() {
        focusedGameIndex++;
    }
}