```
var StdMsg = require('stdmsg').default;
let stdMsg = new StdMsg('me', 'you', inputStream, outputStream);
```
stdMsg.listen([option,] callback)
---

- option <Object>
  - contentType <string> 'string'|'jsonStr'|... Default: jsonStr
- callback
  - err <Error>|<undefined>
  - data <Object>
    - header <Object>
    - content <Object>|<string>|...

exp.
```
stdMsg.listen({contentType: 'string'}, (err, data) => {
    console.log(data);
});
```
stdMsg.send(payload[, option])
---

- payload <Object>|<string>|...
- option <Object>
    contentType <string> 'string'|'jsonStr'|... Default: jsonStr

exp.
```
stdMsg.send({a: 1}, {contentType: 'string'});
```