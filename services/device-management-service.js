var Device = require('../models/device-model.js'),
    DeviceTypeManagementService = require('./device-type-management-service.js');

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
          deviceType: device.deviceType,
        };
        return dev;
      }),
    };
    return callback(0, context);
  });
}

exports.getDevice = function(uuid, callback) {

  Device.find({uuid: uuid}, function (err, devices) {
    if (err) {
      console.error('error while reading devices from DB = ' + err);
      return callback(err, null);
    }

    if (!devices.length) {
      console.error('No devices found in DB...');
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
          deviceType: device.deviceType,
        };
        return dev;
      }),
    };
    return callback(0, context);
  });
}

exports.addDevice = function(device, callback) {
  console.info('device: ' + JSON.stringify(device));
  var deviceToSave = new Device(device);
  deviceToSave.deviceType = device.deviceType.uuid;
  console.info('deviceToSave: ' + JSON.stringify(deviceToSave));


  // validate that the deviceType already exists in the devicetypes collection.
  if (deviceToSave.deviceType == undefined || deviceToSave.deviceType == null) {
        console.log('device does not have a valid device type.');
        return callback(400);
  }
  console.info('deviceToSave.deviceType.uuid: ' + deviceToSave.deviceType.uuid);
  DeviceTypeManagementService.getDeviceType(deviceToSave.deviceType.uuid, function(err) {
    if (err) {
      console.log('device does not have a valid device type.');
      return callback(400);
    }
  });

  // Now save new device into collection "device"
  deviceToSave.save(function(err) {
    if (err) {
      console.log('Error while saving device to database.');
    }
    return callback(err);
  });
}
