function func(e) {
    console.log('rtr')
}

class InputController {
    enabled = false;
    focused = false;
    ACTION_ACTIVATED = "input-controller:activate";
    ACTION_DEACTIVATED = "input-controller:deactivate";
    currentButton = null;

    constructor() {
        this.target = null;
        this.actionsToBind = {};
    }

    bindActions(actionsToBind) {
        this.actionsToBind = Object.assign(this.actionsToBind, actionsToBind)
    }

    changeJump() {
        if (!this.actionsToBind["jump"]) {
            this.actionsToBind = {
                ...this.actionsToBind,
                "jump": {
                    keys: [32],
                    enabled: true
                }
            }
        } else {
            delete this.actionsToBind["jump"]
        }
    }

    enableAction(actionName) {
        if (this.actionsToBind[actionName]) {
            this.actionsToBind[actionName].enabled = true;
        }
    }

    disableAction(actionName) {
        if (this.actionsToBind[actionName]) {
            this.actionsToBind[actionName].enabled = false;
        }
    }

    attach(target, dontEnable = true) {
        this.target = target;

        this.target.addEventListener('keydown', (e) => func(e))
        this.target.addEventListener('keyup', (e) => {
            if (this.currentButton !== e.codeKey) {
                this.currentButton = e.keyCode;
            }
        })

        if (dontEnable) {
            this.target.blur();
        }
    }

    detach() {
        this.target.removeEventListener('keydown', (e) => {
            if (this.currentButton !== e.codeKey) {
                this.currentButton = e.keyCode;
            }
        });
        this.target.removeEventListener('keyup', (e) => {
            if (this.currentButton !== e.codeKey) {
                this.currentButton = e.keyCode;
            }
        });

        this.target = null;
    }

    isActionActive(action) {
        return this.actionsToBind[action].keys.includes(this.currentButton);
    }

    isKeyPressed(keyCode) {
        return this.currentButton === keyCode;
    }

    switchAction(action) {
        if (typeof this.isActionActive(action) === "boolean") {
            if (this.isActionActive(action)) {
                this.disableAction(action)
            } else {
                this.enableAction(action)
            }
        }
    }

    getActions() {
        return this.actionsToBind
    }

    getTarget() {
        return this.target;
    }
}