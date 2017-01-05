var DeviceType = require('../models/device-type-model.js');

exports.getAllDeviceTypes = function(callback) {
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

exports.getDeviceType = function(uuid, callback) {

  DeviceType.find({uuid: uuid}, function (err, deviceTypes) {
    if (err) {
      console.error('error while reading deviceTypes from DB = ' + err);
      return callback(err, null);
    }

    if (!deviceTypes.length) {
      console.error('No deviceTypes found in DB...');
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

exports.addDeviceType = function(deviceType, callback) {
  var deviceTypeToSave = new DeviceType(deviceType);
  console.log('deviceTypeToSave: ' + JSON.stringify(deviceTypeToSave));
  deviceTypeToSave.save(function(err) {
    if (err) {
      console.log('Error while saving device type to database.');
    }
    return callback(err);
  });
}
