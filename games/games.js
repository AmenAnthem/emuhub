const os = require('os');
const loadJsonFile = require('load-json-file');
const childProcess = require('child_process');
const params = new URLSearchParams(window.location.search);
const systemId = params.get('systemId');
const games = loadGames();
const maxVisibleGames = 5;
const lastButtonMaxCycles = 5;

var focusedGameIndex = 0;
var lastButtonIndex = null;
var lastButtonCycles = 0;

addViewControls();
setIntialGames();

function loadGames() {
    return loadJsonFile.sync(os.homedir() + '\\emuhub2\\games\\' + systemId + '\\games.json').games;
}

function setIntialGames() {
    for (var i = 0; i < maxVisibleGames; i++) {
        setGame(games[i], i);
    }
}

function setGame(game, index) {
    var newParams = new URLSearchParams();
    newParams.append('systemId', systemId);
    newParams.append('file', game.file);
    var link = document.createElement('a');
    link.id = game.name;
    link.href = '../commands/commands.html?' + newParams.toString();
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\games\\' + game.file + 'selection.png';
    link.appendChild(image);
    var gameDiv = document.getElementById('game' + index);
    var childNodes = gameDiv.childNodes;
    if (childNodes.length === 0) {
        gameDiv.appendChild(link);
    } else {
        gameDiv.replaceChild(link, childNodes[0]);
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
    window.addEventListener('gamepadconnected', function(event) {
        if (event.gamepad.index === 0) {
            addGamepadPolling();
        }
    });
}

function addGamepadPolling() {
    pollingInterval = setInterval(Gamepad.poll, 50);
}

var Controls = {
    confirm : function() {
        document.getElementById(games[focusedGameIndex].name).click();
    },

    cancel : function() {
        window.history.back();
    },

    left : function() {
        focusedGameIndex === 0 ? focusedGameIndex = games.length - 1 : focusedGameIndex--;
    },

    right : function() {
        focusedGameIndex === games.length - 1 ? focusedGameIndex = 0 : focusedGameIndex++;
    },

    up : function() {
        focusedGameIndex === 0 ? focusedGameIndex = games.length - 1 : focusedGameIndex -= maxVisibleGames;
    },

    down : function() {
        focusedGameIndex === games.length - 1 ? focusedGameIndex = 0 : focusedGameIndex += maxVisibleGames;
    }
}