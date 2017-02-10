var DeviceType = require('../models/device-type-model.js').DeviceType;

exports.getAllDeviceTypes = (callback) => {
  "use strict";
  DeviceType.find(function (err, deviceTypes) {
    if (err) {
      console.error('error while reading device types from DB = ' + err);
      return callback(err, null);
    }

    if (!deviceTypes.length) {
      console.info('No device types found in DB...');
      return callback(0, null);
    }

    var context = {
      deviceTypes: deviceTypes.map(function(deviceType) {
        var dev = {
          uuid: deviceType.uuid,
          timestamp: deviceType.timestamp,
          name: deviceType.name,
          status: deviceType.status,
        };
        return dev;
      }),
    };
    return callback(0, context);
  });
}

exports.getDeviceType = (uuid) => {
  "use strict";
  return new Promise(
    (resolve, reject) => {
      DeviceType.findOne({uuid: uuid}).exec()
      .then(deviceType => { resolve(deviceType); })
      .catch(err => { reject(err); });
  });
}

exports.addDeviceType = (deviceType) => {
  "use strict";
  return new Promise(
    (resolve, reject) => {
      var deviceTypeToSave = new DeviceType(deviceType);
      deviceTypeToSave.save()
      .then(savedDeviceType => { resolve(savedDeviceType); })
      .catch(err => { reject(err); });
  });
}
