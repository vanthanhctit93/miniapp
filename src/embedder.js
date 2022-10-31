import MessageManager from './messageManager';
import Config from './config';

const CHANNEL = '%}sP:Y85"D#6c@RM';
const TYPE_PING = 4;

const PING_INTERVAL = 3000;
const ALIVE_TIMEOUT = 4 * PING_INTERVAL;

class Embedder extends MessageManager {
    constructor (target, origin = '*') {
        super();

        this.target = target;
        this.origin = origin;

        try {
            this.targetWindow = 
                this.target.contentWindow || this.target;
        } catch (e) {
            this.targetWindow = this.target;
        }

        this._handleMessages = this.handleMessages.bind(this);
        this._init();
    }

    _postMessage (message) {
        console.log(message);
        // this.targetWindow.postMessage({
        //     channel: CHANNEL,
        //     ...message
        // }, this.origin);
    }

    _handlePing () {
        clearTimeout(this._monitorAliveTimer);

        this._monitorAliveTimer = setTimeout(
            () => this.emit('interrupted'), 
            ALIVE_TIMEOUT
        );
    }

    _pingLoop () {
        this._pingIntervalTimer = setInterval(() => {
            this._postMessage({
                id: Date.now(),
                type: TYPE_PING
            });
        }, PING_INTERVAL);
    }
      
    _init () {
        // var textMessage = 'ChunkTemplate.hooks.hashForChunk is deprecated';
        // window.addEventListener('message', this._handleMessages);
        // gatewaySdk.reviceToApp(textMessage);
        

        webkit.messageHandlers.gatewaySdk.postMessage({ someProp: 'gatewaySdk' })
        
        gatewaySdk.getMethods();

        if (this.target === window.parent) {
            this._pingLoop();
        } else {
            this._handlePing();
        }

        this.fireEvent('loaded');
    }

    destroy () {
        window.removeEventListener('message', this._handleMessages);

        clearInterval(this._pingIntervalTimer);
        clearTimeout(this._monitorAliveTimer);
    }

    async handleMessages ({ data, source }) {
        if (
            !data || 
            data.channel != CHANNEL ||
            source !== this.targetWindow
        ) {
            return;
        }

        if (
            !this.onMessage(data) &&
            data.type == TYPE_PING
        ) {
            this._handlePing();
        } 
    }

    static create (parentEl, url) {
        var iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.title = 'FPT Play Embedder';
        iframe.setAttribute('frameborder', '0');
        
        Object.assign(iframe.style, {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
        });

        parentEl.appendChild(iframe);

        return new Embedder(iframe);
    }
}

const parent = (() => {
    var cache;
    return () => cache || (cache = new Embedder(window.parent));
})(); 

const embed = (parentEl, url) => Embedder.create(parentEl, url);

export {
    Embedder as default,
    parent,
    embed,
};
