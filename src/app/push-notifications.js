var socketio = require('socket.io'),
    webSocketIO = null,
    features = require('./features'),
    socket = null;

function _sendNotification(event) {
  "use strict";
  if (features.pushNotifications !== true) return;

  if (socket) {
    console.log('\nsending notification: ' + JSON.stringify(event));
    socket.emit(event.name, {deviceId: event.device, message: event.message});
  }
}

var startWebSocketServer = (webServer) => {
  "use strict";

  if (features.pushNotifications !== true) {return;}

  webSocketIO = socketio(webServer);
  webSocketIO.on('connection', (skt) => {
    socket = skt;
    socket.on('join', (data) => {console.log(data);});
    socket.on('disconnect', () => {console.log('A client disconnected');});
  });
};

var sendDeviceReadingNotification = (readings) => {
  "use strict";
  var event = {};
  event.name = 'deviceReadings';
  event.uuid = readings.uuid;
  event.message = 'A device reading is now available';
  _sendNotification(event);
};

var sendDisplayBrightnessNotification = (event) => {_sendNotification(event);};

var sendPlayAudioNotification = (event) => {_sendNotification(event);};

module.exports = {startWebSocketServer, sendDeviceReadingNotification, sendDisplayBrightnessNotification, sendPlayAudioNotification};
