class InputController {
    enabled = false;
    focused = false;
    ACTION_ACTIVATED = "input-controller:activate";
    ACTION_DEACTIVATED = "input-controller:deactivate";
    currentButtons = new Set();

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

        this.keydownHandler = (e) => {
            this.currentButtons.add(e.keyCode);
            this.checkActions();
        }

        this.keyupHandler = (e) => {
            this.currentButtons.delete(e.keyCode);
            this.checkActions();
        }

        this.target.addEventListener('keydown', this.keydownHandler)
        this.target.addEventListener('keyup',  this.keyupHandler)

        if (dontEnable) {
            this.target.blur();
        }
    }

    detach() {
        this.target.removeEventListener('keydown', this.keydownHandler);
        this.target.removeEventListener('keyup',  this.keyupHandler);

        this.target = null;
        this.currentButtons.clear();
    }

    isActionActive(action) {
        const actionData = this.actionsToBind[action];
        if (!actionData || !actionData.keys.length || this.currentButtons.size === 0) {
            return false;
        }

       return actionData.keys.some(key => this.currentButtons.has(key));
    }

    checkActions() {
        if (!this.enabled) return;

        for (const actionName in this.actionsToBind) {
            const isActive = this.isActionActive(actionName);

            if (isActive) {
                document.dispatchEvent(new CustomEvent(this.ACTION_ACTIVATED, { detail: actionName }));
            }

            if (!isActive) {
                document.dispatchEvent(new CustomEvent(this.ACTION_DEACTIVATED, { detail: actionName }));
            }
        }
    }

    isKeyPressed(keyCode) {
        return this.currentButtons.has(keyCode);
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