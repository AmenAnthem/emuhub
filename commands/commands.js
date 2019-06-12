const remote = require('electron').remote;
const os = require('os');
const loadJsonFile = require('load-json-file');
const childProcess = require('child_process');

var params = new URLSearchParams(window.location.search);
var systemId = params.get('systemId');
var commands = loadCommands();
var focusedCommandIndex = 0;
var lastButtonIndex;

addViewControls();
addHeader();
addCommands();

function loadCommands() {
    var systems = loadJsonFile.sync(os.homedir() + '\\emuhub2\\systems\\systems.json').systems;
    for (var i = 0; i < systems.length; i++) {
        var system = systems[i];
        if (system.id === systemId) {
            return system.commands;
        }
    }
    return [];
}

function addCommands() {
    for (var i = 0; i < commands.length; i++) {
        addCommand(commands[i]);
    }
}

function addCommand(command) {
    var link = document.createElement('a');
    link.id = command.name;
    link.href = '#';
    link.onclick = createOnclick(command.command);
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\commands\\' + command.name + 'selection.png';
    link.appendChild(image);
    document.body.appendChild(link);
}

function createOnclick(command) {
    return (function(currentCommand) {
        return function() {
            runCommand(currentCommand + ' \"' + os.homedir() + '\\emuhub2\\games\\' + systemId + '\\' + params.get('file') + '\"');
        }
    })(command);
}

function runCommand(command) {
    remote.getCurrentWindow().hide();
    childProcess.exec(command.replace(/HOME/g, os.homedir()), function(error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        remote.getCurrentWindow().show();
    });
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
                document.getElementById(commands[focusedCommandIndex].name).click();
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