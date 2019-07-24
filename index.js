const gpsd = require('node-gpsd');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const listener = new gpsd.Listener({
  port: 2947,
  hostname: 'localhost',
  logger: {
    info: console.log,
    warn: console.warn,
    error: console.error
  },
  parse: true
});


listener.connect(function () {
  console.log('Connected');
  listener.watch();
  listener.version(); /* a INFO event will be emitted */
  listener.devices(); /* a DEVICES event will be emitted */
  listener.device(); /* a DEVICE event will be emitted */
});

wss.on('connection', function connection(ws) {
  console.log("Websocket client connected");
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  function sendMessage(data) {
    const jsonData = JSON.stringify(data);
    console.log(jsonData);
    ws.send(jsonData);
  }

  listener.on("TPV", sendMessage);
  listener.on("SKY", sendMessage);
  listener.on("INFO", sendMessage);
  listener.on("DEVICE", sendMessage);
});
