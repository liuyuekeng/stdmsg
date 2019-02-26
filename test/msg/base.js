const MsgContentType = require('../../output/msg/base').MsgContentType;
const expect = require('chai').expect;

describe('msg base', () => {
    it('MsgContentType check', () => {
        expect(MsgContentType).to.be.an('Object');
        expect(MsgContentType.JsonStr).to.be.a('string');
        expect(MsgContentType.String).to.be.a('string');
    });
});