import EventEmitter from 'events';
import util from 'util';

const TYPE_REQ = 1;
const TYPE_RES = 2;
const TYPE_EVENT = 3;

const ERRORS = {
    1: 'Not found the command "%s"',
    2: '%s'
};

class MessageManager extends EventEmitter {
    constructor () {
        super();

        this._commands = {};
        this._promises = {};
    }

    _sendErr (id, error) {
        this._postMessage({
            type: TYPE_RES,
            id,
            error
        });
    }

    _sendErrCode (id, code, message) {
        var error = util.format(
            ERRORS[code],
            message
        );
        
        this._sendErr(id, [ code, error ]);
    }

    _sendRes (id, result) {
        this._postMessage({
            type: TYPE_RES,
            id,
            result
        });
    }

    async _handleReq (id, command, args) {
        var fn = this._commands[command];

        if (!fn) {
            return this._sendErrCode(id, 1, command);
        }

        try {
            var result = await fn.apply(null, args);
            this._sendRes(id, result);
        } catch (e) {
            this._sendErrCode(id, 2, e.message);
            console.error(e);
        }
    }

    _handleRes (id, result, error) {
        if (!this._promises[id]) return;
        
        var { resolve, reject } = this._promises[id];
        delete this._promises[id];

        if (error) return reject(error);
        resolve(result);
    }

    _handleEvent (id, args) {
        this.emit.apply(this, [ id, ...args ]);
    }

    genId () {
        return Date.now().toString(36) + Math.round(Math.random() * 9999999).toString(36);
    }

    onMessage (data) {
        if (
            !data ||
            !data.id ||
            ![ TYPE_REQ, TYPE_RES, TYPE_EVENT ].includes(data.type)
        ) {
            return false;
        }

        if (
            data.type == TYPE_REQ &&
            typeof data.command === 'string' && 
            Array.isArray(data.args)
        ) {
            this._handleReq(data.id, data.command, data.args);
        } else if (data.type == TYPE_RES) {
            this._handleRes(data.id, data.result, data.error);
        } else if (data.type == TYPE_EVENT) {
            this._handleEvent(data.id, data.args);
        } else {
            return false;
        }

        return true;
    }

    applyCmd (command, args) {
        return new Promise((resolve, reject) => {
            var id = this.genId();

            this._postMessage({  
                type: TYPE_REQ,
                id,
                command,
                args
            });

            this._promises[id] = { resolve, reject };
        });
    }

    callCmd (commnd, ...args) {
        return this.applyCmd(commnd, args);
    }

    fireEvent (id, ...args) {
        this._postMessage({  
            type: TYPE_EVENT,
            id,
            args
        });
    }

    portCmds (commands) {
        commands.forEach(cmd => {
            if (!this[cmd]) {
                this[cmd] = (...args) => this.applyCmd(cmd, args);
            }
        });
    }

    register (command, callback) {
        if (typeof command !== 'string') {
            throw new Error('The param "command" must be a string');
        }

        if (typeof callback !== 'function') {
            throw new Error('The param "callback" must be a function');
        }

        this._commands[command] = callback;
    }

    extends (commands) {
        Object.keys(commands)
            .forEach(command => this.register(command, commands[command]));

        this.fireEvent('extended', Object.keys(this._commands));
    }
}

export default MessageManager;
