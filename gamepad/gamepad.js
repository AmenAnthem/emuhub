var Gamepad = {
    lastButtonIndex : null,
    lastButtonCycles : 0,

    poll : function() {
        var buttons = navigator.getGamepads()[0].buttons;
        for (var i = 0; i < buttons.length; i++) {
            if (lastButtonIndex === i) {
                lastButtonCycles++;
                if (lastButtonCycles >= lastButtonMaxCycles) {
                    Gamepad.clearLastButton();
                }
            }
            var button = buttons[i];
            if (lastButtonIndex !== i && (button.pressed || button.value > 0)) {
                lastButtonIndex = i;
                Gamepad.executeControls(i);
            }
        }
    },

    executeControls : function(buttonIndex) {
        if (buttonIndex === 0) {
            Controls.confirm();
        } else if (buttonIndex === 1) {
            Controls.cancel();
        } else if (buttonIndex === 14) {
            Controls.left();
        } else if (buttonIndex === 15) {
            Controls.right();
        } else if (buttonIndex === 12) {
            Controls.up();
        } else if (buttonIndex === 13) {
            Controls.down();
        }
    },

    clearLastButton : function() {
        lastButtonIndex = null;
        lastButtonCycles = 0;
    }
}