const remote = require('electron').remote;
const os = require('os');
const loadJsonFile = require('load-json-file');
const systems = loadSystems();
const maxVisibleSystems = 3;
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
    for (var i = 0; i < maxVisibleSystems; i++) {
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
    pollingInterval = setInterval(Gamepad.poll, 50);
}

var Controls = {
    confirm : function() {
        document.getElementById(systems[focusedSystemIndex].id).click();
    },

    cancel : function() {
        remote.getCurrentWindow().close();
    },

    left : function() {
        focusedSystemIndex === 0 ? focusedSystemIndex = systems.length - 1 : focusedSystemIndex--;
    },

    right : function() {
        focusedSystemIndex === systems.length - 1 ? focusedSystemIndex = 0 : focusedSystemIndex++;
    },

    up : function() {
        focusedSystemIndex === 0 ? focusedSystemIndex = systems.length - 1 : focusedSystemIndex -= maxVisibleSystems;
    },

    down : function() {
        focusedSystemIndex === systems.length - 1 ? focusedSystemIndex = 0 : focusedSystemIndex += maxVisibleSystems;
    }
}