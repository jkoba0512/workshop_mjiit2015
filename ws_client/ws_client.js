var WebSocket = require('ws');
var ws = new WebSocket('ws://10.0.1.26:8080');

ws.on('open', function () {
    var message1 = 'Hello!';
    var message2 = 'You look so cool!';

    ws.send(message1);
    console.log('(client) sent:', message1);

    ws.send(message2);
    console.log('(client) sent:', message2);
});

ws.on('message', function (data, flags) {
    console.log('(client) received: %s', data);
});
