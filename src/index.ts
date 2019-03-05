import MsgParser from './msg/msg-parser';
import {MsgParserOption} from './msg/msg-parser';
import MsgWrapper from './msg/msg-wrapper';
import {MsgWrapperOption} from './msg/msg-wrapper';
import {Writable, Readable} from "stream";
import {Msg} from './msg/base';
export default class Stdmsg {
    constructor(public me: string,
        public you: string,
        public inputStream: Readable,
        public outputStream: Writable) {
        this.inputStream.setEncoding('utf8');
        this.outputStream.setDefaultEncoding('utf8');
    }
    send(payload:any, opt?:  MsgWrapperOption) {
        let wrapper = new MsgWrapper(this.me, opt);
        let message = wrapper.wrap(this.you, payload);
        this.outputStream.write(message);
    }
    listen(cb: (err: object|undefined, data: Msg) => void): void
    listen(opt: MsgParserOption, cb: Function): void
    listen(optOrCb: Function|MsgParserOption, cb?: Function): void {
        let _opt: MsgParserOption;
        let _cb: Function;
        if (typeof optOrCb === 'function') {
            _cb = optOrCb;
            _opt = {}
        } else {
            _cb = cb;
            _opt = optOrCb;
        }
        let stdoutCb = () => {
            let parser = new MsgParser(this.me, _opt, _cb);
            return function (data: string) {
                parser.parse(data);
            }
        }
        this.inputStream.on('data', stdoutCb());
    }
}