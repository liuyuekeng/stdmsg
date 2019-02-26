const expect = require('chai').expect
const MsgWrapper = require('../../output/msg/msg-wrapper').default;

describe('class MsgWrapper', () => {
    it('should pack raw data into message format', () => {
        let instance = new MsgWrapper('me');
        let message = instance.wrap('you', {a: 1});
        expect(message).to.equal('[stdmsg:me:you:7]{"a":1}');
    });
    it('should handle "string" content type', () => {
        let instance = new MsgWrapper('me', {contentType: 'string'});
        let message = instance.wrap('you', 'a+b');
        expect(message).to.equal('[stdmsg:me:you:3]a+b');
    });
    it('should throw error while raw data did not match content type', () => {
        let instance = new MsgWrapper('me');
        let err;
        try {
            instance.wrap('you', 'a+b');
        } catch (e) {
            err = e;
        }
        expect(err).to.be.an('Error');
        err = undefined;
        instance.setOpt({contentType: 'string'});
        try {
            instance.wrap('you', {a: 1});
        } catch (e) {
            err = e;
        }
        expect(err).to.be.an('Error');
    });
    it('method "setOpt" should update option', () => {
        let instance = new MsgWrapper('me');
        instance.setOpt({contentType: 'string'});
        let message = instance.wrap('you', 'a+b');
        expect(message).to.equal('[stdmsg:me:you:3]a+b');
    })
});