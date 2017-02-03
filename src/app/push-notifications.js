var socketio = require('socket.io'),
    webSocketIO = null,
    features = require('./features'),
    socket = null;

var startWebSocketServer = (webServer) => {
  "use strict";

  if (features.pushNotifications !== true) {return;}

  webSocketIO = socketio(webServer);
  console.log('push notifications enabled ');
  webSocketIO.on('connection', (skt) => {
    socket = skt;
    socket.on('join', function(data) {
       console.log(data);
    });
    socket.on('disconnect', () => {console.log('A client disconnected');});
  });
};

var sendDeviceReadingNotification = (readings) => {
  "use strict";
  if (features.pushNotifications !== true) {return;}

  if (socket) {
    console.log('\nsend deviceReadings notification: ' + JSON.stringify(readings));
    socket.emit('deviceReadings', {deviceId: readings.uuid, message: 'A device reading is now available'});
  }
};

var sendDisplayBrightnessNotification = (event) => {
  "use strict";
  if (features.pushNotifications !== true) return;

  if (socket) {
    console.log('\nsending displayBrightness notification: ' + JSON.stringify(event));
    socket.emit(event.name, {deviceId: event.device, message: event.message});
  }
};

module.exports = {startWebSocketServer, sendDeviceReadingNotification, sendDisplayBrightnessNotification};
