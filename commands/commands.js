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
updateVisibleCommands();

function loadCommands() {
    var systems = loadJsonFile.sync(os.homedir() + '\\emuhub\\systems\\systems.json').systems;
    for (var i = 0; i < systems.length; i++) {
        var system = systems[i];
        if (system.id === systemId) {
            return system.commands;
        }
    }
    return [];
}

function updateVisibleCommands() {
    setCommand(commands[previousCommandIndex()], 0);
    setCommand(commands[focusedCommandIndex], 1);
    setCommand(commands[nextCommandIndex()], 2);
}

function setCommand(command, index) {
    var link = document.createElement('a');
    link.id = 'commandlink' + index;
    link.href = '#';
    link.onclick = createOnclick(command.command);
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub\\images\\commands\\' + command.name + '.png';
    link.appendChild(image);
    var commandDiv = document.getElementById('command' + index);
    var childNodes = commandDiv.childNodes;
    if (childNodes.length === 0) {
        commandDiv.appendChild(link);
    } else {
        commandDiv.replaceChild(link, childNodes[0]);
    }
    setFirstChildNode(document.getElementById('command' + index), link);
    if (index === 1) {
        setFirstChildNode(document.getElementById('commandsFooter'), document.createTextNode(command.name));
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

function createOnclick(command) {
    return (function(currentCommand) {
        return function() {
            runCommand(currentCommand + ' \"' + os.homedir() + '\\emuhub\\games\\' + systemId + '\\' + file + '\"');
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

function previousCommandIndex() {
    return focusedCommandIndex === 0 ? commands.length - 1 : focusedCommandIndex - 1;
}

function nextCommandIndex() {
    return focusedCommandIndex === commands.length - 1 ? 0 : focusedCommandIndex + 1;
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
        Gamepad.clearLastButton();
        document.getElementById('commandlink1').click();
    },

    cancel : function() {
        Gamepad.clearLastButton();
        window.history.back();
    },

    left : function() {
        focusedCommandIndex = previousCommandIndex();
        updateVisibleCommands();
    },

    right : function() {
        focusedCommandIndex = nextCommandIndex();
        updateVisibleCommands();
    },

    up : function() {
        for (var i = 0; i < maxVisibleCommands; i++) {
            focusedCommandIndex = previousCommandIndex();
        }
        updateVisibleCommands();
    },

    down : function() {
        for (var i = 0; i < maxVisibleCommands; i++) {
            focusedCommandIndex = nextCommandIndex();
        }
        updateVisibleCommands();
    }
}