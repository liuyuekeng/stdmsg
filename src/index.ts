import MsgParser from './msg/msg-parser';
import {MsgParserOption} from './msg/msg-parser';
import MsgWrapper from './msg/msg-wrapper';
import {MsgWrapperOption} from './msg/msg-wrapper';
import { Stream } from "stream";

interface stdStream extends Stream {
    setEncoding: Function
}

export default class Stdmsg {
    constructor(public id: string) {
    }
    sent(to: string, payload:any, opt?:  MsgWrapperOption) {
        let wrapper = new MsgWrapper(this.id, opt);
        let message = wrapper.wrap(to, payload);
        console.log(message);
    }
    listen(stdStream: stdStream, cb: Function): void
    listen(stdStream: stdStream, opt: MsgParserOption, cb: Function): void
    listen(stdStream: stdStream, optOrCb: Function|MsgParserOption, cb?: Function): void {
        let _opt;
        typeof optOrCb === 'function' ? cb = optOrCb : _opt = optOrCb;
        stdStream.setEncoding('utf8');
        let stdoutCb = (data: string) => {
            let parser = new MsgParser(this.id, _opt, cb);
            parser.parse(data);
        }
        stdStream.on('data', stdoutCb);
    }
}