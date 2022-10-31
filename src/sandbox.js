const processEvents = (embed) => {
    const fireKeyboardEvent = (type, keycode) => {
        var ev = new KeyboardEvent(type, {
            bubbles: true,
            cancelable: true,
            view: window,
            which: keycode,
            keyCode: keycode
        });

        Object.defineProperties(ev, {
            keyCode: { get: () => keycode },
            which: { get: () => keycode }        
        });
        
        window.dispatchEvent(ev);
    };

    var mouseEl;

    const fireMouseEvent = (type, x, y, el, bubbles = true) => {
        el = el || document.elementFromPoint(x, y);

        if (type == 'mousemove') {
            if (mouseEl != el) {
                fireMouseEvent('mouseleave', x, y, mouseEl, false);
                fireMouseEvent('mouseenter', x, y, null, false);
            }
        } else if (type == 'mouseenter') {
        } else if (type == 'mouseleave') {
        }

        var rect = el.getBoundingClientRect();

        var ev = new MouseEvent(type, {
            screenX: x, 
            screenY: y,
            clientX: x - rect.x,
            clientY: x - rect.y,
            bubbles,
            cancelable: bubbles,
            view: window,
        });
        
        el.dispatchEvent(ev);
        return mouseEl = el;
    };

    embed.on('keydown', code => {
        fireKeyboardEvent('keydown', code);
        setTimeout(() => fireKeyboardEvent('keyup', code), 50);
    });

    embed.on('mousemove', (x, y) => fireMouseEvent('mousemove', x, y));
    embed.on('mousedown', (x, y) => fireMouseEvent('mousedown', x, y));

    embed.on('mouseup', (x, y) => {
        var el = fireMouseEvent('mouseup', x, y);
        if (mouseEl === el) {
            fireMouseEvent('click', x, y);
        }
    });

    document.addEventListener('focusin', () => embed.fireEvent('child_got_focus'));
};

const init = async embed => {
    if (typeof window.pluginInit !== 'function') {
        throw new Error('Not found the init function "pluginInit"');
    }

    processEvents(embed);

    await window.pluginInit(embed);
};

async function main () {
    var arr = [];
    console.log('Connect to Sdk successfully !!!');

    const embed = (await import('./embedder')).parent();
    var methods = await gatewaySdk.getMethods();
    console.log('1 => Connected to Methods: ', methods);

    arr.push(methods);
    arr.forEach(method => {
        console.log('3 => Connected to Method: ', method);
        if (!embed[method]) {
            embed[method] = (...args) => embed.applyCmd(method, args);
            console.log('2.1 => Connected to Method: ', embed[method]);
        }
    });
    
    try {
        await init(embed);
        embed.fireEvent('ready');
    } catch (e) {
        console.error(e);
        embed.fireEvent('error', e.message);
    }
}

main();
