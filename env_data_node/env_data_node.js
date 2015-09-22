var http = require('http');
var fs = require('fs');

// settings for SPI
var SPI = require('pi-spi');
var spi = SPI.initialize('/dev/spidev0.0');
var MCP3002_CH0 = Buffer([0x68, 0]);
var MCP3002_CH1 = Buffer([0x78, 0]);

// variables for light and sensors
var light_value, temp_value;

// obtaining data from ADC ch0 (light sensor) every 1 s
setInterval(function () {
    spi.transfer(MCP3002_CH0, MCP3002_CH0.length, function (err, data) {
        if (err) console.log(err);
        else {
            light_value = ((data[0] << 8) + data[1]) & 0x03ff;
            console.log('light:', light_value);
        }
    });
}, 1000);

// obtaining data from ADC ch1 (temperature sensor) every 1 s
setInterval(function () {
    spi.transfer(MCP3002_CH1, MCP3002_CH1.length, function (err, data) {
        if (err) console.log(err);
        else {
            var value = ((data[0] << 8) + data[1]) & 0x03ff;
            temp_value = (100.0 * 3.3 / 1023 * value).toFixed(1);
            console.log('temperature (C):', temp_value);
        }
    });
}, 1000);

// settings for server
var server = http.createServer();

server.on('request', function (req, res) {
    fs.readFile(__dirname + '/public/index.html', 'utf-8', function (err, data) {
        if (err) {
            res.writeHead(404);
            res.write('not found!');
            return res.end();
        }
        res.writeHead(200);
    	res.write(data);
    	res.end();
    });
});

server.listen(8080);
console.log('listening on port 8080...');

// settings for WebSocket server
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: server});
wss.on('connection', function (ws) {
    ws.on('message', function (msg) {
        if (msg == 'get') {
            var data = new Object();
            data.light = light_value;
            data.temp = temp_value;
            dataJSON = JSON.stringify(data);
            ws.send(dataJSON);
        }
        else console.log('failed');
    })
});
