const os = require('os');
const loadJsonFile = require('load-json-file');
const childProcess = require('child_process');

var params = new URLSearchParams(window.location.search);
var commands = params.getAll('command');
var commandNames = params.getAll('commandName');
var focusedCommandIndex = 0;

addViewControls();
addHeader();
addCommands();

function addCommands() {
    for (var i = 0; i < commands.length; i++) {
        addCommand(commands[i], commandNames[i]);
    }
}

function addCommand(command, commandName) {
    var link = document.createElement('a');
    link.id = commandName;
    link.href = '#';
    link.onclick = createOnclick(command);
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\commands\\' + commandName + 'selection.png';
    link.appendChild(image);
    document.body.appendChild(link);
}

function createOnclick(command) {
    return (function(currentCommand) {
        return function() {
            runCommand(currentCommand + ' \"' + params.get('romFolderPath') + '\\' + params.get('romName') + '\"');
        }
    })(command);
}

function runCommand(command) {
    childProcess.exec(command.replace(/HOME/g, os.homedir()), function(error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
    });
}

function addHeader() {
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\systems\\' + params.get('id') + 'header.png';
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
                document.getElementById(commandNames[focusedCommandIndex]).click();
            } else if (i === 1) {
                window.history.back();
            } else if (i === 15) {
                focusedCommandIndex++;
            }
        }
    }
}