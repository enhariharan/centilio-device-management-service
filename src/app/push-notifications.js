var socketio = require('socket.io'),
    webSocketIO = null,
    features = require('./features');
var socket = null;

var startWebSocketServer = (webServer) => {
  "use strict";

  if (features.pushNotifications !== true) {return;}

  webSocketIO = socketio(webServer);
  console.log('push notificatios enabled ');
  webSocketIO.on('connection', (skt) => {
    socket = skt;
    console.log('A new client connected: ' + JSON.stringify(socket));
    // setTimeout(() => {socket.emit('testerEvent', { description: 'A custom event named testerEvent!'});}, 4000);
    socket.on('disconnect', () => {console.log('A client disconnected');});
  });
};

var sendDeviceReadingNotification = (readings) => {
  "use strict";
  if (features.pushNotifications !== true) {return;}
  if (socket) socket.emit('readingsNotification', {description: 'A device reading is now available'});
};

module.exports = {startWebSocketServer, sendDeviceReadingNotification};
