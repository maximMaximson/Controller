(function() {
    const ball = document.getElementById("ball");
    const square = document.getElementById("square");
    const selector = document.getElementById("selector");
    const detachButton = document.getElementById("detachButton");
    const onButton = document.getElementById("onButton");
    const offButton = document.getElementById("offButton");
    const jumpBindButton = document.getElementById("jumpBindButton");
    const changeButton = document.getElementById('changeButton')

    let isJumping = false;

    const Controller = new InputController({
        "up": {
            keys: [87, 38],
            enabled: true,
        },
        "down": {
            keys: [83, 40],
            enabled: true,
        },
        "left": {
            keys: [65, 37],
            enabled: true,
        },
        "right": {
            keys: [68, 39],
            enabled: true,
        }
    }, ball);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            Controller.focused = false;
        } else {
            Controller.focused = true;
        }
    });

    function fillSelector() {
        const currentValue = selector.value;
        selector.innerHTML = '';

        for (const name in Controller.getActions()) {
            const opt = document.createElement("option");

            opt.value = name;
            opt.textContent = `${name} - ${Controller.getActions()[name].enabled ? 'Включено' : 'Выключено'}`

            selector.appendChild(opt);
        }

        if (currentValue && currentValue in Controller.getActions()) {
            selector.value = currentValue;
        } else {
            selector.value = Object.keys(Controller.getActions())[0]
        }
    }

    fillSelector();

    document.addEventListener('keydown', (e) => {
        if ((e.code === "Space") && Controller.enabled) {
            singleJump();
        }

        function singleJump() {
            if (isJumping || !Controller.getTarget()) {
                return;
            }

            const currentTopValue = parseInt(Controller.getTarget().style.top) || 325;
            isJumping = true;
            let pos = 0;

            let isMovingUp = true;

            const jumpInterval = setInterval(() => {
                if (!('jump' in Controller.getActions()) || !Controller.getActions()['jump'].enabled) {
                    return
                }

                if (isMovingUp) {
                    pos += 5;
                    Controller.getTarget().style.top = (currentTopValue - pos) + 'px';

                    if (pos >= 100) {
                        isMovingUp = false;
                    }
                } else {
                    pos -= 5;
                    Controller.getTarget().style.top = (currentTopValue - pos) + 'px';

                    if (pos <= 0) {
                        clearInterval(jumpInterval);
                        isJumping = false;
                    }
                }
            }, 16)
        }
    })

    document.addEventListener(Controller.ACTION_ACTIVATED, (e) => {
        if (!Controller.enabled) {
            return;
        }

        console.log('Действие включено');

        const currentXPos = parseInt(Controller.getTarget().style.left) || 0;
        const currentYPos = parseInt(Controller.getTarget().style.top) || 0;


        switch (e.detail) {
            case 'up':
                Controller.getTarget().style.top = (currentYPos - 10) + 'px';
                break;
            case 'down':
                Controller.getTarget().style.top = (currentYPos + 10) + 'px';
                break;
            case 'left':
                Controller.getTarget().style.left = (currentXPos - 10) + 'px';
                break;
            case 'right':
                Controller.getTarget().style.left = (currentXPos + 10) + 'px';
                break;
        }
    })

    document.addEventListener(Controller.ACTION_DEACTIVATED, () => {
        if (Controller.enabled) {
            console.log('Действие выключено');
        }
    })

    detachButton.onclick = () => {
        Controller.detach();
        detachButton.disabled = true;
    }

    onButton.onclick = () => {
        Controller.enabled = true;
        onButton.disabled = true;
        offButton.disabled = false;
        Controller.getTarget().focus();
        console.log('Контроллер включен', Controller.enabled);
    }

    offButton.onclick = () => {
        Controller.enabled = false;
        offButton.disabled = true;
        onButton.disabled = false;
        console.log('Контроллер выключен', Controller.enabled);
    }

    jumpBindButton.onclick = () => {
        if (Controller.enabled) {
            Controller.changeJump();
            fillSelector();
        }
    }

    ball.onclick = () => {
        Controller.attach(ball, false);
        detachButton.disabled = false;
    }

    square.onclick = () => {
        Controller.attach(square, false);
        detachButton.disabled = false;
    }

    changeButton.onclick = () => {
        if (Controller.enabled) {
            const name = selector.value;
            if (Controller.getActions()[name].enabled) {
                Controller.disableAction(name);
            } else {
                Controller.enableAction(name);
            }

            fillSelector();
        }
    }
})();