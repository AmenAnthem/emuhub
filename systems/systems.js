const remote = require('electron').remote;
const os = require('os');
const loadJsonFile = require('load-json-file');
const systems = loadSystems();
const lastButtonMaxCycles = 5;

var focusedSystemIndex = 0;
var lastButtonIndex = null;
var lastButtonCycles = 0;

addViewControls();
setInitialSystems();

function loadSystems() {
    return loadJsonFile.sync(os.homedir() + '\\emuhub2\\systems\\systems.json').systems;
}

function setInitialSystems() {
    for (var i = 0; i < 3; i++) {
        setSystem(systems[i], i);
    }
}

function setSystem(system, index) {
    var newParams = new URLSearchParams();
    newParams.append('systemId', system.id);
    var link = document.createElement('a');
    link.id = system.id;
    link.href = '../games/games.html?' + newParams.toString();
    var image = document.createElement('img');
    image.src = os.homedir() + '\\emuhub2\\images\\systems\\' + system.id + 'selection.png';
    link.appendChild(image);
    var systemDiv = document.getElementById('system' + index);
    var childNodes = systemDiv.childNodes;
    if (childNodes.length === 0) {
        systemDiv.appendChild(link);
    } else {
        systemDiv.replaceChild(link, childNodes[0]);
    }
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
            addGamepadPolling();
        }
    });
}

function addGamepadPolling() {
    pollingInterval = setInterval(pollGamepad, 50);
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