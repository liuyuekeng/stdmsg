const Stdmsg = require('../../output/index').default;
const {spawn} = require('child_process')
const path = require('path');
const expect = require('chai').expect
let cp = spawn('node', [path.join(__dirname, '../lib/child-process.js')]);
let stdMsg = new Stdmsg('parent', 'child', cp.stdout, cp.stdin);

describe('class Stdmsg', () => {
    it('sent & listen method should work', done => {
        stdMsg.listen((err, data) => {
            expect(err).to.equal(undefined);
            expect(data.content.type).to.equal('received');
            done();
        });
        stdMsg.sent({type: 'sent'});
    })
});