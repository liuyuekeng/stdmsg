const Stdmsg = require('../../output/index').default;

let stdmsg = new Stdmsg('child', 'parent', process.stdin, process.stdout);
stdmsg.listen((err, data) => {
    stdmsg.send({type: 'received'});
});