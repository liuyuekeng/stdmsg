const Stdmsg = require('../../output/index').default;
const {spawn} = require('child_process')
const path = require('path');
const expect = require('chai').expect
let cp = spawn('node', [path.join(__dirname, '../lib/child-process.js')]);
let stdMsg = new Stdmsg('parent', 'child', cp.stdout, cp.stdin);

describe('class Stdmsg', () => {
    it('send & listen method should work', done => {
        let count = 0;
        function check() {
            count ++;
            (count === 2) && done();
        }
        stdMsg.listen((err, data) => {
            console.log(data.content);
            expect(err).to.equal(undefined);
            expect(data.content.type).to.be.a('string');
            switch (data.content.type) {
                case 'received':
                    expect(data.content.type).to.equal('received');
                    check();
                    break;
                case 'bigPayloadRes':
                    expect(data.content.data.a.length).to.equal(1000);
                    check();
                    break;
            }
        });
        stdMsg.send({type: 'send'});
        stdMsg.send({type: 'bigPayload'});
    });
});