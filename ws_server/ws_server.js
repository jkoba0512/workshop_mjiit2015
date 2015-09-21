var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});

console.log('listening on port 8080...');

wss.on('connection', function (ws) {
    console.log('connected to a client');

    ws.on('message', function (message) {
        console.log('(server) received: %s', message);
        var reply;

        if (message == 'Hello!') {
            reply = 'Hi, I am Jun!';
        }
        else {
            reply = 'You bet!';
        }

        ws.send(reply);
        console.log('(server) sent:', reply);
    });

    ws.on('close', function () {
        console.log('closed');
    })
});
