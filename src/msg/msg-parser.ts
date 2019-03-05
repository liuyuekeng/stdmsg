import {MsgContentType, MsgHeader} from './base';

export interface MsgParserOption {
    contentType?: MsgContentType
}

const msgHeadRegexp = /\[stdmsg:(\w+):(\w+):(\d+)\]/g;
export default class MsgParser {
    remain: string
    remainLen: number
    unfinished: boolean
    currentHeader: MsgHeader
    defaultOpt: MsgParserOption = {
        contentType: MsgContentType.JsonStr
    }
    id: string
    cb: Function
    opt: MsgParserOption
    constructor(id: string, opt: MsgParserOption, cb: Function)
    constructor(id: string, cb: Function)
    constructor(id: string, optOrCb:Function|MsgParserOption, cb?) {
        let _opt;
        typeof optOrCb === 'function' ? cb = optOrCb : _opt = optOrCb;
        this.id = id;
        this.cb = cb;
        this.opt = Object.assign({}, this.defaultOpt, _opt);
        this.remain = '';
        this.remainLen = 0;
        this.currentHeader = {from: '', to: '', len: ''};
        this.unfinished = false;
    }
    setOpt(opt: MsgParser) {
        Object.assign(this.opt, opt);
    }
    handleRemain(str: string): string {
        if (this.unfinished) {
            str = this.remain + str;
            if (str.length < this.remainLen) {
                this.remain = str;
                str = '';
            } else {
                this.unfinished = false;
                this.outputRes(str.slice(0, this.remainLen));
                str = str.slice(this.remainLen);
                this.remain = '';
                this.remainLen = 0;
            }
        }
        return str;
    }
    parse(raw: string): void {
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
                    } else {
                        this.outputRes(str.slice(0, len));
                        str = str.slice(len);
                    }
                }
            } else {
                str  = '';
            }
        }
    }
    outputRes(raw: string): void {
        let content;
        let err;
        switch(this.opt.contentType) {
            case MsgContentType.JsonStr : {
                try {
                    content = JSON.parse(raw);
                } catch (e) {
                    err = new Error('message parse failed');
                }
                break;
            }
            case MsgContentType.String:
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