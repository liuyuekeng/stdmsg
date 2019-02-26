"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const msgHeadRegexp = /\[stdmsg:(\w+):(\w+):(\d+)\]/g;
class MsgParser {
    constructor(id, optOrCb, cb) {
        this.defaultOpt = {
            contentType: base_1.MsgContentType.JsonStr
        };
        let _opt;
        typeof optOrCb === 'function' ? cb = optOrCb : _opt = optOrCb;
        this.id = id;
        this.cb = cb;
        this.opt = Object.assign({}, this.defaultOpt, _opt);
        this.remain = '';
        this.remainLen = 0;
        this.currentHeader = { from: '', to: '', len: '' };
        this.unfinished = false;
    }
    setOpt(opt) {
        Object.assign(this.opt, opt);
    }
    handleRemain(str) {
        if (this.unfinished) {
            str = this.remain + str;
            if (str.length < this.remainLen) {
                this.remain = str;
                str = '';
            }
            else {
                this.unfinished = false;
                this.outputRes(str.slice(0, this.remainLen));
                str = str.slice(this.remainLen);
                this.remain = '';
                this.remainLen = 0;
            }
        }
        return str;
    }
    parse(raw) {
        let str = this.handleRemain(raw);
        while (str.length) {
            msgHeadRegexp.lastIndex = 0;
            let header = msgHeadRegexp.exec(str);
            if (header) {
                [
                    this.currentHeader.from,
                    this.currentHeader.to,
                    this.currentHeader.len,
                ] = header.slice(1);
                str = str.slice(msgHeadRegexp.lastIndex);
                if (this.currentHeader.to === this.id) {
                    let len = parseInt(this.currentHeader.len, 10);
                    if (str.length < len) {
                        this.unfinished = true;
                        this.remain = str;
                        this.remainLen = len;
                        str = '';
                    }
                    else {
                        this.outputRes(str.slice(0, len));
                        str = str.slice(len);
                    }
                }
            }
            else {
                str = '';
            }
        }
    }
    outputRes(raw) {
        let content;
        let err;
        switch (this.opt.contentType) {
            case base_1.MsgContentType.JsonStr: {
                try {
                    content = JSON.parse(raw);
                }
                catch (e) {
                    err = new Error('message parse failed');
                }
                break;
            }
            case base_1.MsgContentType.String:
            default:
                content = raw;
                break;
        }
        this.cb(err, err ? undefined : {
            header: this.currentHeader,
            content,
        });
    }
}
exports.default = MsgParser;
