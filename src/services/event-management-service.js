var PushNotifications = require('../app/push-notifications');
var Errors = require('../security/errors').errors;

exports.sendEventNotification = (event) => {
  "use strict";
  return new Promise() {
    (resolve, reject) => {
        console.log('\nsendEventNotification() - event: ' + JSON.stringify(event));
        console.log('\nevent.name: ' + JSON.stringify(event.name));
        switch (event.name) {
        case 'displayBrightness':
          console.log('\ndisplayBrightness');
          PushNotifications.sendDisplayBrightnessNotification(event);
          resolve(event);
          break;

        case 'playAudio':
          console.log('\nplayAudio');
          PushNotifications.sendPlayAudioNotification(event);
          resolve(event);
          break;

        default:
          console.log('\nerror');
          reject(Errors.emptyOrUnknownEvent); // sending 400 - bad request error for an unknown event
          break;
      }
  }}
};
