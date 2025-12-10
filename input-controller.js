class InputController {
    enabled = false;
    focused = false;
    ACTION_ACTIVATED = "input-controller:activate";
    ACTION_DEACTIVATED = "input-controller:deactivate";
    currentButtons = new Set();

    constructor(actionsToBind = {}, target = null) {
        this.target = null;
        this.actionsToBind = {};
        this.bindActions(actionsToBind);
        if (target) this.attach(target);

        window.addEventListener('focus', () => this.focused = true);
        window.addEventListener('blur', () => this.focused = false);
        document.addEventListener('visibilitychange', () => {
            this.focused = !document.hidden;
        });
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
        if (this.target === target) {
            return;
        }

        if(this.target) {
            this.detach();
        }

        this.target = target;

        this.keydownHandler = (e) => {
            if (!this.enabled || !this.focused) return;
            this.currentButtons.add(e.keyCode);
            this.checkActions();
        }

        this.keyupHandler = (e) => {
            if (!this.enabled || !this.focused) return;
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
            const action = this.actionsToBind[actionName];
            if (!action.enabled) continue;

            if (isActive && !action._active) {
                document.dispatchEvent(new CustomEvent(this.ACTION_ACTIVATED, { detail: actionName }));
                action._active = true;
            }

            if (!isActive && action._active) {
                document.dispatchEvent(new CustomEvent(this.ACTION_DEACTIVATED, { detail: actionName }));
                action._active = false;
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