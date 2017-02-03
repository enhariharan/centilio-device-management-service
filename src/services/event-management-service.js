var PushNotifications = require('../app/push-notifications');

exports.sendEventNotification = (event) => {
  "use strict";
  return new Promise() {
    (resolve, reject) => {
      switch (event.name) {
        case 'displayBrightness':
          PushNotifications.sendDisplayBrightnessNotification(event);
          resolve();
          break;

        case 'playAudio':
          PushNotifications.sendPlayAudioNotification(event);
          resolve();
          break;

        default:
          reject(400); // sending 400 - bad request error for an unknown event
          break;
      }
  }}
};
