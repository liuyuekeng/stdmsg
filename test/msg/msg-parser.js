const expect = require('chai').expect
const MsgParser = require('../../output/msg/msg-parser').default;

describe('class MsgParser', function() {
    it('should parse message currectly', (done) => {
        let instance = new MsgParser('me', (err, msg) => {
            expect(err).to.equal(undefined);
            expect(msg).to.be.an('object');
            expect(msg).to.have.property('header');
            expect(msg.header.from).to.equal('you');
            expect(msg.header.to).to.equal('me');
            expect(msg.header.len).to.equal('7');
            expect(msg).to.have.property('content');
            expect(msg.content.a).to.equal(1);
            done();
        });
        instance.parse('[stdmsg:you:me:7]{"a":1}');
    });
    it('should ignore message not for this id', (done) => {
        let flag = false;
        let instance =new MsgParser('me', (err, msg) => {
            flag = true;
        });
        instance.parse('[stdmsg:you:notme:7]{"a":1}');
        process.nextTick(() => {
            expect(flag).to.equal(false);
            done();
        });
    });
    it('should ignore input in other format', (done) => {
        let flag = false;
        let instance =new MsgParser('me', (err, msg) => {
            flag = true;
        });
        instance.parse('xxxx');
        process.nextTick(() => {
            expect(flag).to.equal(false);
            done();
        });
    });
    it('should handle mutiple message in one input', (done) => {
        let res = []
        let count = 0;
        let instance =new MsgParser('me', (err, msg) => {
            res.push([err, msg]);
            count ++;
            if (count === 2) {
                expect(res[0][0]).to.equal(undefined);
                expect(res[0][1].content.a).to.equal(1);
                expect(res[1][0]).to.equal(undefined);
                expect(res[1][1].content.a).to.equal(2);
                done();
            }
        });
        instance.parse('[stdmsg:you:me:7]{"a":1}some thing\n[stdmsg:you:me:7]{"a":2}some thing else')
    });
    it('should hold unfinished message, util it is done', (done) => {
        let instance = new MsgParser('me', (err, msg) => {
            expect(err).to.equal(undefined);
            expect(msg.content).to.equal(123456789);
            done();
        });
        instance.parse('[stdmsg:you:me:9]');
        instance.parse('123');
        instance.parse('456');
        instance.parse('789');
    });
    it('should return error while parse faild', (done) => {
        let instance = new MsgParser('me', (err, msg) => {
            expect(err).not.to.equal(undefined);
            expect(msg).to.equal(undefined)
            done();
        });
        instance.parse('[stdmsg:you:me:3]a+b');
    });
    it('should parse string content', (done) => {
        let instance = new MsgParser('me', {contentType: 'string'}, (err, msg) => {
            expect(err).to.equal(undefined);
            expect(msg.content).to.equal('a+b');
            done();
        });
        instance.parse('[stdmsg:you:me:3]a+b');
    });
    it('method "setOpt" should update option', (done) => {
        let interface = new MsgParser('me', (err, msg) => {
            expect(err).to.equal(undefined);
            expect(msg.content).to.equal('a+b');
            done();
        });
        interface.setOpt({contentType: 'string'});
        interface.parse('[stdmsg:you:me:3]a+b');
    })
});