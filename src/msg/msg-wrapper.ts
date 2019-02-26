/**
 * @file class MsgWrapper
 * @author liuyuekeng
 */

import {MsgContentType} from './base';

export interface MsgWrapperOption {
    contentType?: MsgContentType
}

export default class MsgWrapper {
    defaultOpt: MsgWrapperOption = {
        contentType: MsgContentType.JsonStr
    }
    opt: MsgWrapperOption
    constructor(public id: string, opt?: MsgWrapperOption) {
        this.opt = Object.assign({}, this.defaultOpt, opt);
    }
    setOpt(opt: MsgWrapperOption) {
        Object.assign(this.opt, opt);
    }
    wrap(to: string, raw: any): string {
        let contentType = this.opt.contentType || MsgContentType.String;
        let payload;
        switch (contentType) {
            case MsgContentType.JsonStr: {
                if (typeof raw !== 'object') {
                    throw new Error('unexpected input type');
                }
                try {
                    payload = JSON.stringify(raw);
                } catch (e) {
                    throw new Error('message wrap faild');
                }
                break;
            }
            case MsgContentType.String: {
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