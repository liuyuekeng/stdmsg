"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const msg_parser_1 = require("./msg/msg-parser");
const msg_wrapper_1 = require("./msg/msg-wrapper");
class Stdmsg {
    constructor(id) {
        this.id = id;
    }
    sent(to, payload, opt) {
        let wrapper = new msg_wrapper_1.default(this.id, opt);
        let message = wrapper.wrap(to, payload);
        console.log(message);
    }
    listen(stdStream, optOrCb, cb) {
        let _opt;
        typeof optOrCb === 'function' ? cb = optOrCb : _opt = optOrCb;
        stdStream.setEncoding('utf8');
        let stdoutCb = (data) => {
            let parser = new msg_parser_1.default(this.id, _opt, cb);
            parser.parse(data);
        };
        stdStream.on('data', stdoutCb);
    }
}
exports.default = Stdmsg;
