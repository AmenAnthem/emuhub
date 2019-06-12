const os = require('os');
const loadJsonFile = require('load-json-file');
const childProcess = require('child_process');

var params = new URLSearchParams(window.location.search);
var systemId = params.get('systemId');
var games = loadGames();
var focusedGameIndex = 0;
var lastButtonIndex;

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
            setInterval(pollGamepad, 50);
        }
    });
}

function pollGamepad() {
    var buttons = navigator.getGamepads()[0].buttons;
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        if (lastButtonIndex !== i && (button.pressed || button.value > 0)) {
            lastButtonIndex = i;
            if (i === 0) {
                document.getElementById(games[focusedGameIndex].name).click();
            } else if (i === 1) {
                window.history.back();
            } else if (i === 14 || i === 12) {
                focusedSystemIndex--;
            } else if (i === 15 || i === 13) {
                focusedSystemIndex++;
            }
        }
    }
}