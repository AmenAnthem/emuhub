var Gamepad = {
    lastButtonIndex : null,
    lastButtonCycles : 0,

    poll : function() {
        var buttons = navigator.getGamepads()[0].buttons;
        for (var i = 0; i < buttons.length; i++) {
            if (lastButtonIndex === i) {
                lastButtonCycles++;
                if (lastButtonCycles >= lastButtonMaxCycles) {
                    lastButtonIndex = null;
                    lastButtonCycles = 0;
                }
            }
            var button = buttons[i];
            if (lastButtonIndex !== i && (button.pressed || button.value > 0)) {
                lastButtonIndex = i;
                if (i === 0) {
                    GamepadControls.confirm();
                } else if (i === 1) {
                    GamepadControls.cancel();
                } else if (i === 14 || i === 12) {
                    GamepadControls.left();
                } else if (i === 15 || i === 13) {
                    GamepadControls.right();
                }
            }
        }
    }
}