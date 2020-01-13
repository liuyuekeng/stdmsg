"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const msg_parser_1 = require("./msg/msg-parser");
const msg_wrapper_1 = require("./msg/msg-wrapper");
class Stdmsg {
    constructor(me, you, inputStream, outputStream) {
        this.me = me;
        this.you = you;
        this.inputStream = inputStream;
        this.outputStream = outputStream;
        this.inputStream.setEncoding('utf8');
        this.outputStream.setDefaultEncoding('utf8');
        this.callbacks = [];
    }
    send(payload, opt) {
        let wrapper = new msg_wrapper_1.default(this.me, opt);
        let message = wrapper.wrap(this.you, payload);
        this.outputStream.write(message);
    }
    listen(optOrCb, cb) {
        let _opt;
        let _cb;
        if (typeof optOrCb === 'function') {
            _cb = optOrCb;
            _opt = {};
        }
        else {
            _cb = cb;
            _opt = optOrCb;
        }
        let stdoutCb = () => {
            let parser = new msg_parser_1.default(this.me, _opt, _cb);
            return function (data) {
                parser.parse(data);
            };
        };
        const listener = stdoutCb();
        this.inputStream.on('data', listener);
        this.callbacks.push(listener);
    }
    close() {
        this.callbacks.forEach(cb => {
            this.inputStream.removeListener('data', cb);
        });
    }
}
exports.default = Stdmsg;
