class InputController {
    enabled = false;
    focused = false;
    ACTION_ACTIVATED = "input-controller:activate";
    ACTION_DEACTIVATED = "input-controller:deactivate";

    constructor() {
        this.target = null;
        this.actionsToBind = {};
    }

    bindActions(actionsToBind) {
        this.actionsToBind = Object.assign(this.actionsToBind, actionsToBind)

        console.log(this.actionsToBind);
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

        console.log(this.actionsToBind);
    }

    enableAction(actionName) {
        if (this.actionsToBind[actionName]) {
            console.log("До:", this.actionsToBind[actionName].enabled);
            this.actionsToBind[actionName].enabled = true;
            console.log("После:", this.actionsToBind[actionName].enabled);
        }
    }

    disableAction(actionName) {
        if (this.actionsToBind[actionName]) {
            console.log("До:", this.actionsToBind[actionName].enabled);
            this.actionsToBind[actionName].enabled = false;
            console.log("После:", this.actionsToBind[actionName].enabled);
        }
    }

    attach(target, dontEnable = true) {
        if (!dontEnable) {
            this.target = document.getElementById(target);
            console.log(target);
        }
    }

    detach() {
        console.log(`${this.target === document.getElementById('ball') ? 'Шар' : 'Квадрат'} откреплен`);
        this.target = null;
    }

    isActionActive(action) {
        if (this.actionsToBind[action]) {
            return this.actionsToBind[action].enabled
        } else {
            console.log('Нет данного свойства');
        }
    }

    isKeyPressed(keyCode) {
        res = false;
        window.addEventListener("keydown", (e => e.key === keyCode ? res = true : res = false))
        return res;
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