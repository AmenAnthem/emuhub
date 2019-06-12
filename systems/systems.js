const remote = require('electron').remote;
const os = require('os');
const loadJsonFile = require('load-json-file');

var systems = loadSystems();
var focusedSystemIndex = 0;
var lastButtonIndex;

addViewControls();
addSystems();

function loadSystems() {
    return loadJsonFile.sync(os.homedir() + '\\emuhub2\\systems\\systems.json').systems;
}

function addSystems() {
    for (var i = 0; i < systems.length; i++) {
        addSystem(systems[i]);
    }
}

function addSystem(system) {
    var newParams = new URLSearchParams();
    newParams.append('systemId', system.id);
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
                document.getElementById(systems[focusedSystemIndex].id).click();
            } else if (i === 1) {
                remote.getCurrentWindow().close();
            } else if (i === 14 || i === 12) {
                focusedSystemIndex--;
            } else if (i === 15 || i === 13) {
                focusedSystemIndex++;
            }
        }
    }
}