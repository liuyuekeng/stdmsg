const Stdmsg = require('../../output/index').default;

let stdmsg = new Stdmsg('child', 'parent', process.stdin, process.stdout);
stdmsg.listen((err, data) => {
    switch (data.content.type) {
        case 'send':
            stdmsg.send({type: 'received'});
            break;
        case 'bigPayload':
            let data = {a: []};
            for (let i = 0; i < 1000; i ++) {
                data.a.push(Math.random());
            }
            stdmsg.send({type: 'bigPayloadRes', data});
            break;
    }
});