"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class MsgWrapper {
    constructor(id, opt) {
        this.id = id;
        this.defaultOpt = {
            contentType: base_1.MsgContentType.JsonStr
        };
        this.opt = Object.assign({}, this.defaultOpt, opt);
    }
    setOpt(opt) {
        Object.assign(this.opt, opt);
    }
    wrap(to, raw) {
        let contentType = this.opt.contentType || base_1.MsgContentType.String;
        let payload;
        switch (contentType) {
            case base_1.MsgContentType.JsonStr: {
                if (typeof raw !== 'object') {
                    throw new Error('unexpected input type');
                }
                try {
                    payload = JSON.stringify(raw);
                }
                catch (e) {
                    throw new Error('message wrap faild');
                }
                break;
            }
            case base_1.MsgContentType.String: {
                if (typeof raw !== 'string') {
                    throw new Error('unexpected input type');
                }
                payload = raw;
                break;
            }
        }
        if (!payload) {
            throw new Error('empty message');
        }
        let len = payload.length;
        let message = `[stdmsg:${this.id}:${to}:${len}]${payload}`;
        return message;
    }
}
exports.default = MsgWrapper;
