const os = require('os');
const loadJsonFile = require('load-json-file');
const childProcess = require('child_process');

var params = new URLSearchParams(window.location.search);

addViewControls();
loadHeader();
loadCommands();

function loadCommands() {
    var commands = params.getAll('command');
    for (var commandIndex = 0; commandIndex < commands.length; commandIndex++) {
        var link = document.createElement('a');
        link.href = '#';
        var command = commands[commandIndex];
        link.onclick = createOnclick(command);
        link.appendChild(document.createTextNode(command));
        document.body.appendChild(link);
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
}

function loadHeader() {
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\systems\\' + params.get('id') + 'header.png';
    document.body.appendChild(image);
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