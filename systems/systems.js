const remote = require('electron').remote;
const os = require('os');
const loadJsonFile = require('load-json-file');

var systems = loadJsonFile.sync(os.homedir() + '\\emuhub2\\systems.json').systems;
var focusedSystemIndex = 0;

addViewControls();
addSystems();

function addSystems() {
    for (var i = 0; i < systems.length; i++) {
        addSystem(systems[i]);
    }
}

function addSystem(system) {
    var newParams = new URLSearchParams();
    newParams.append('id', system.id);
    newParams.append('romFolderPath', system.romFolderPath);
    var commands = system.commands;
    for (var i = 0; i < commands.length; i++) {
        newParams.append('commandName', commands[i].name);
        newParams.append('command', commands[i].command);
    }
    var link = document.createElement('a');
    link.id = system.id;
    link.href = '../games/games.html?' + newParams.toString();
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\systems\\' + system.id + 'selection.png';
    link.appendChild(image);
    document.body.appendChild(link);
}

function addViewControls() {
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'Escape':
                remote.getCurrentWindow().close();
                break;
        }
    });
    window.addEventListener('gamepadconnected', function(event) {
        var gamepad = event.gamepad;
        if (event.gamepad.index === 0) {
            setInterval(pollGamepad, 50);
        }
    });
}

function pollGamepad() {
    var buttons = navigator.getGamepads()[0].buttons;
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        if (button.pressed || button.value > 0) {
            if (i === 0) {
                document.getElementById(systems[focusedSystemIndex].id).click();
            } else if (i === 1) {
                remote.getCurrentWindow().close();
            } else if (i === 15) {
                focusedSystemIndex++;
            }
        }
    }
}