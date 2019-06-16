const remote = require('electron').remote;
const os = require('os');
const loadJsonFile = require('load-json-file');
const childProcess = require('child_process');
const params = new URLSearchParams(window.location.search);
const systemId = params.get('systemId');
const file = params.get('file');
const commands = loadCommands();
const maxVisibleCommands = 3;
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
    for (var i = 0; i < 3; i++) {
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
    pollingInterval = setInterval(Gamepad.poll, 50);
}

function removeGamepadPolling() {
    clearInterval(pollingInterval);
}

var Controls = {
    confirm : function() {
        document.getElementById(commands[focusedCommandIndex].name).click();
    },

    cancel : function() {
        window.history.back();
    },

    left : function() {
        focusedCommandIndex === 0 ? focusedCommandIndex = commands.length - 1 : focusedCommandIndex--;
    },

    right : function() {
        focusedCommandIndex === commands.length - 1 ? focusedCommandIndex = 0 : focusedCommandIndex++;
    },

    up : function() {
        focusedCommandIndex === 0 ? focusedCommandIndex = commands.length - 1 : focusedCommandIndex -= maxVisibleCommands;
    },

    down : function() {
        focusedCommandIndex === commands.length - 1 ? focusedCommandIndex = 0 : focusedCommandIndex += maxVisibleCommands;
    }
}