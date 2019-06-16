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
updateVisibleGames();

function loadGames() {
    return loadJsonFile.sync(os.homedir() + '\\emuhub2\\games\\' + systemId + '\\games.json').games;
}

function updateVisibleGames() {
    setGame(games[farPreviousGameIndex()], 0);
    setGame(games[previousGameIndex()], 1);
    setGame(games[focusedGameIndex], 2);
    setGame(games[nextGameIndex()], 3);
    setGame(games[farNextGameIndex()], 4);
}

function setGame(game, index) {
    var newParams = new URLSearchParams();
    newParams.append('systemId', systemId);
    newParams.append('file', game.file);
    var link = document.createElement('a');
    link.id = 'gamelink' + index;
    link.href = '../commands/commands.html?' + newParams.toString();
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\games\\' + game.file + 'selection.png';
    link.appendChild(image);
    setFirstChildNode(document.getElementById('game' + index), link);
    if (index === 2) {
        setFirstChildNode(document.getElementById('gamesFooter'), document.createTextNode(game.name));
    }
}

function setFirstChildNode(element, childNode) {
    var childNodes = element.childNodes;
    if (childNodes.length === 0) {
        element.appendChild(childNode);
    } else {
        element.replaceChild(childNode, childNodes[0]);
    }
}

function previousGameIndex() {
    return focusedGameIndex === 0 ? games.length - 1 : focusedGameIndex - 1;
}

function farPreviousGameIndex() {
    if (focusedGameIndex === 1) {
        return games.length - 1;
    }
    return focusedGameIndex === 0 ? games.length - 2 : focusedGameIndex - 2;
}

function nextGameIndex() {
    return focusedGameIndex === games.length - 1 ? 0 : focusedGameIndex + 1;
}

function farNextGameIndex() {
    if (focusedGameIndex === games.length - 1) {
        return 1;
    }
    return focusedGameIndex === games.length - 2 ? 0 : focusedGameIndex + 2;
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
        document.getElementById('gamelink2').click();
    },

    cancel : function() {
        window.history.back();
    },

    left : function() {
        focusedGameIndex = previousGameIndex();
        updateVisibleGames();
    },

    right : function() {
        focusedGameIndex = nextGameIndex();
        updateVisibleGames();
    },

    up : function() {
        for (var i = 0; i < maxVisibleGames; i++) {
            focusedGameIndex = previousGameIndex();
        }
        updateVisibleGames();
    },

    down : function() {
        for (var i = 0; i < maxVisibleGames; i++) {
            focusedGameIndex = nextGameIndex();
        }
        updateVisibleGames();
    }
}