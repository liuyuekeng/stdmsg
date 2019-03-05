export enum MsgContentType {
    JsonStr = 'jsonStr',
    String = 'string'
}
export interface MsgHeader {
    from: string,
    to: string,
    len: string
}

export interface Msg {
    header: MsgHeader,
    content?: any
}