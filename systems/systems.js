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
updateVisibleSystems();

function loadSystems() {
    return loadJsonFile.sync(os.homedir() + '\\emuhub2\\systems\\systems.json').systems;
}

function updateVisibleSystems() {
    setSystem(systems[previousSystemIndex()], 0);
    setSystem(systems[focusedSystemIndex], 1);
    setSystem(systems[nextSystemIndex()], 2);
}

function setSystem(system, index) {
    var newParams = new URLSearchParams();
    newParams.append('systemId', system.id);
    var link = document.createElement('a');
    link.id = 'systemlink' + index;
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

function previousSystemIndex() {
    return focusedSystemIndex === 0 ? systems.length - 1 : focusedSystemIndex - 1;
}

function nextSystemIndex() {
    return focusedSystemIndex === systems.length - 1 ? 0 : focusedSystemIndex + 1;
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
        document.getElementById('systemlink1').click();
    },

    cancel : function() {
        remote.getCurrentWindow().close();
    },

    left : function() {
        focusedSystemIndex = previousSystemIndex();
        updateVisibleSystems();
    },

    right : function() {
        focusedSystemIndex = nextSystemIndex();
        updateVisibleSystems();
    },

    up : function() {
        for (var i = 0; i < maxVisibleSystems; i++) {
            focusedSystemIndex = previousSystemIndex();
        }
        updateVisibleSystems();
    },

    down : function() {
        for (var i = 0; i < maxVisibleSystems; i++) {
            focusedSystemIndex = nextSystemIndex();
        }
        updateVisibleSystems();
    }
}