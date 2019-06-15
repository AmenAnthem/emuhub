const remote = require('electron').remote;
const os = require('os');
const loadJsonFile = require('load-json-file');
const childProcess = require('child_process');
const params = new URLSearchParams(window.location.search);
const systemId = params.get('systemId');
const file = params.get('file');
const commands = loadCommands();
const lastButtonMaxCycles = 5;

var focusedCommandIndex = 0;
var lastButtonIndex = null;
var lastButtonCycles = 0;
var pollingInterval = null;

addViewControls();
setIntialCommands();

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

function setIntialCommands() {
    for (var i = 0; i < commands.length; i++) {
        setCommand(commands[i], i);
    }
}

function setCommand(command, index) {
    var link = document.createElement('a');
    link.id = command.name;
    link.href = '#';
    link.onclick = createOnclick(command.command);
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\commands\\' + command.name + 'selection.png';
    link.appendChild(image);
    var commandDiv = document.getElementById('command' + index);
    var childNodes = commandDiv.childNodes;
    if (childNodes.length === 0) {
        commandDiv.appendChild(link);
    } else {
        commandDiv.replaceChild(link, childNodes[0]);
    }
}

function createOnclick(command) {
    return (function(currentCommand) {
        return function() {
            runCommand(currentCommand + ' \"' + os.homedir() + '\\emuhub2\\games\\' + systemId + '\\' + file + '\"');
        }
    })(command);
}

function runCommand(command) {
    removeGamepadPolling();
    remote.getCurrentWindow().hide();
    childProcess.exec(command.replace(/HOME/g, os.homedir()), function(error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        remote.getCurrentWindow().show();
        addGamepadPolling();
    });
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
    pollingInterval = setInterval(pollGamepad, 50);
}

function removeGamepadPolling() {
    clearInterval(pollingInterval);
}

function pollGamepad() {
    var buttons = navigator.getGamepads()[0].buttons;
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        if (lastButtonIndex === i) {
            lastButtonCycles++;
            if (lastButtonCycles >= lastButtonMaxCycles) {
                lastButtonIndex = null;
                lastButtonCycles = 0;
            }
        }
        if (lastButtonIndex !== i && (button.pressed || button.value > 0)) {
            lastButtonIndex = i;
            if (i === 0) {
                document.getElementById(commands[focusedCommandIndex].name).click();
            } else if (i === 1) {
                window.history.back();
            } else if (i === 14 || i === 12) {
                focusedCommandIndex--;
            } else if (i === 15 || i === 13) {
                focusedCommandIndex++;
            }
        }
    }
}