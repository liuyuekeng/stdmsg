```
var StdMsg = require('stdmsg').default;
let stdMsg = new StdMsg('me');
```
stdMsg.listen(stdStream[, option], callback)
---

- stdStream <Stream> stdout or stdin
- option <Object>
  - contentType <string> 'string'|'jsonStr'|... Default: jsonStr
- callback
  - err <Error>|<undefined>
  - data <Object>
    - header <Object>
    - content <Object>|<string>|...

exp.
```
stdMsg.listen(childProcess.stdout, {contentType: 'string'}, (err, data) => {
    console.log(data);
});
```
stdMsg.sent(to, payload[, option])
---

- to <string> id
- payload <Object>|<string>|...
- option <Object>
    contentType <string> 'string'|'jsonStr'|... Default: jsonStr

exp.
```
stdMsg.sent('you', {a: 1}, {contentType: 'string'});
```