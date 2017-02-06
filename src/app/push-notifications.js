var socketio = require('socket.io'),
    webSocketIO = null,
    features = require('./features'),
    socketsMap = new Map(),
    deviceToSocketsMap = new Map();

var _event = {
  name: '',
  uuid: '',
  message: {}
};

var _sendNotification = (eventName, deviceUuid, message) => {
  "use strict";
  if (features.pushNotifications !== true) return;

  var socketId = deviceToSocketsMap.get(deviceUuid);
  if (!socketId || socketId === undefined) return;

  var socket = socketsMap.get(socketId);
  console.log('\nsending notification for event %s for device %s via socket %s', JSON.stringify(eventName), JSON.stringify(deviceUuid), JSON.stringify(socketId));
  if (!socket || socket === undefined) return;

  socket.emit(eventName, {deviceId: deviceUuid, message: message});
};

var _disconnect = (socket) => {
  "use strict";
  console.log('\n_disconnect(%s) ', socket.id);
  socketsMap.delete(socket.id);
  deviceToSocketsMap.forEach((value, key) => {
    if (value === socket.id) {
      deviceToSocketsMap.delete(key);
      console.log('\nsocket ' + socket.id + ' of device ' + key + ' disconnected');
    }
  });
}

var _mapDeviceToSocket = (deviceUuid, socketId) => {
  "use strict";
  deviceToSocketsMap.set(deviceUuid, socketId) = new Map();
  console.log('\nmapped device ' + deviceUuid + ' to socket ' + socket.id);
}

var _handleNewConnection = (socket) => {
  "use strict";
  socketsMap.set(JSON.stringify(socket.id), socket);
  socket.on('join', (deviceUuid) => {_mapDeviceToSocket(deviceUuid, socket.id)});
  socket.on('disconnect', () => {_disconnect(socket)});
  socket.on('hi', (deviceUuid) => {console.log('deviceUuid; %s', deviceUuid);});
  socket.emit('hi', {device: '0123456789'});
};

var startWebSocketServer = (webServer) => {
  "use strict";
  if (features.pushNotifications !== true) return;
  webSocketIO = socketio(webServer);
  webSocketIO.on('connection', _handleNewConnection);
};

var sendDeviceReadingNotification = (readings) => {
  "use strict";
  _sendNotification('deviceReadings', readings.device, readings);
};

var sendDisplayBrightnessNotification = (event) => {
  "use strict";
  _sendNotification('displayBrightness', event.device, event.message);
};

var sendPlayAudioNotification = (event) => {
  "use strict";
  _sendNotification('playAudio', event.device, event.message);
};

module.exports = {startWebSocketServer, sendDeviceReadingNotification, sendDisplayBrightnessNotification, sendPlayAudioNotification};
