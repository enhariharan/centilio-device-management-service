var Device = require('../models/device-model.js');

exports.getAllDevices = function(callback) {
  Device.find(function (err, devices) {
    if (err) {
      console.error('error while reading devices from DB = ' + err);
      return callback(err, null);
    }

    if (!devices.length) {
      console.info('No devices found in DB...');
      return callback(0, null);
    }

    var context = {
      devices: devices.map(function(device) {
        var dev = {
          uuid: device.uuid,
          timestamp: device.timestamp,
          name: device.name,
          latitude: device.latitude,
          longitude: device.longitude,
          status: device.status,
        };
        return dev;
      }),
    };
    return callback(0, context);
  });
}

exports.addDevice = function(device, callback) {
  var deviceToSave = new Device(device);
  deviceToSave.save(function(err) {
    if (err) {
      console.log('Error while saving device to database.');
    }
    return callback(err);
  });
}
