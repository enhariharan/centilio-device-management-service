var Device = require('../models/device-model.js').Device,
    DeviceTypeManagementService = require('./device-type-management-service.js');

var _parseAndSendDevices = (devices, callback) => {
  var context = {
    devices: devices.map( d => {
      var device = {
        uuid: d.uuid,
        timestamp: d.timestamp,
        serverTimestamp: d.serverTimestamp,
        name: d.name,
        latitude: d.latitude,
        longitude: d.longitude,
        status: d.status,
        deviceType: d.deviceType,
        deviceId: d.deviceId,
      };
      return device;
    }),
  };
  return callback(0, context);
};

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
          serverTimestamp: device.serverTimestamp,
          name: device.name,
          latitude: device.latitude,
          longitude: device.longitude,
          status: device.status,
          deviceType: device.deviceType,
          deviceId: device.deviceId
        };
        return dev;
      }),
    };
    console.info('\ncontext: ' + JSON.stringify(context));
    return callback(0, context);
  });
}

exports.getDevice = function(uuid, callback) {
  var devices = null;

  Device.find({uuid: uuid}).exec().then(
    devices => {
      if (devices && devices.length !== null && devices.length > 0) return _parseAndSendDevices(devices, callback)
      else return Device.find({deviceId: uuid}).exec();
  })
  .then(
    devices => {
      if (devices && devices.length !== null && devices.length > 0) return _parseAndSendDevices(devices, callback)
      else return callback(0, null);
  });
}

exports.getDevicesByClient = function(clientUuid, callback) {
  Device.find({client: clientUuid}, function (err, devices) {
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
          serverTimestamp: device.serverTimestamp,
          name: device.name,
          latitude: device.latitude,
          longitude: device.longitude,
          status: device.status,
          deviceType: device.deviceType,
          deviceId: device.deviceId,
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
  deviceToSave.deviceType = device.deviceType;
  console.info('deviceToSave: ' + JSON.stringify(deviceToSave));

  // validate that the deviceType already exists in the devicetypes collection.
  if (deviceToSave.deviceType == undefined || deviceToSave.deviceType == null) {
        console.log('device does not have a valid device type.');
        return callback(400);
  }
  console.info('deviceToSave.deviceType: ' + deviceToSave.deviceType);
  DeviceTypeManagementService.getDeviceType(deviceToSave.deviceType, function(err) {
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
