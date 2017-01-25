var Device = require('../models/device-model').Device,
    Client = require('../models/client-model').Client,
    Role = require('../models/role-model').Role,
    DeviceTypeManagementService = require('./device-type-management-service');

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

exports.getAllDevices = (callback) => {
  Device.find((err, devices) => {
    if (err) {
      console.error('error while reading devices from DB = ' + err);
      return callback(err, null);
    }

    if (!devices.length) {
      console.info('No devices found in DB...');
      return callback(0, null);
    }

    var context = {
      devices: devices.map(d => {
        var dev = {
          uuid: d.uuid,
          timestamp: d.timestamp,
          serverTimestamp: d.serverTimestamp,
          name: d.name,
          latitude: d.latitude,
          longitude: d.longitude,
          status: d.status,
          deviceType: d.deviceType,
          deviceId: d.deviceId
        };
        return dev;
      }),
    };
    console.info('\ncontext: ' + JSON.stringify(context));
    return callback(0, context);
  });
}

exports.getDevice = (id, callback) => {
  Device.find({uuid: id}).exec().then(devices => {
    if (devices && devices.length !== null && devices.length > 0) return _parseAndSendDevices(devices, callback);
    else return Device.find({deviceId: id}).exec();
  })
  .then(devices => {
    if (devices && devices.length !== null && devices.length > 0) return _parseAndSendDevices(devices, callback);
    else return callback(0, null);
  });
}

exports.getDevicesByClient = (clientUuid, showAllDevices, showUnassignedDevicesOnly) => {
  return new Promise(
    (resolve, reject) => {
      Client.find({uuid: clientUuid}).exec()
      .then(clients => {
        return Role.find({uuid: clients[0].role}).exec();
      })
      .then(roles => {
        if ((roles[0].name !== 'admin') && (showAllDevices === 'true')) reject(403);
        if ((roles[0].name !== 'admin') && (showUnassignedDevicesOnly === 'true')) reject(403);
        if ((showAllDevices !== 'true') && (showUnassignedDevicesOnly === 'true')) reject(400);
        if (roles[0].name === 'admin') {
          if (showAllDevices === 'true') return (showUnassignedDevicesOnly === 'true') ? Device.find({client: {$exists: false}}).exec() : Device.find().exec();
        }
        return Device.find({client: clientUuid}).exec();
      })
      .then(devices => {
        if (!devices.length) {
          console.error('No devices found in DB...');
          resolve(null);
        }

        var context = {
          devices: devices.map(d => {
            var dev = {
              uuid: d.uuid,
              timestamp: d.timestamp,
              serverTimestamp: d.serverTimestamp,
              name: d.name,
              latitude: d.latitude,
              longitude: d.longitude,
              status: d.status,
              deviceType: d.deviceType,
              deviceId: d.deviceId,
              client: d.client,
            };
            return dev;
          }),
        };
        resolve(context);
      })
      .catch(err => {
        console.log('error occured while reading devices by client: ' + err.stack);
        reject(err);
      });
  });
}

exports.addDevice = (device, callback) => {
  var deviceToSave = new Device(device);
  deviceToSave.deviceType = device.deviceType;

  // validate that the deviceType already exists in the devicetypes collection.
  if (deviceToSave.deviceType == undefined || !deviceToSave.deviceType) {
        console.log('device does not have a valid device type.');
        return callback(400);
  }
  DeviceTypeManagementService.getDeviceType(deviceToSave.deviceType, err => {
    if (err) {
      console.log('device does not have a valid device type.');
      return callback(400);
    }
  });

  // Now save new device into collection "device"
  deviceToSave.save(err => {
    if (err) console.log('Error while saving device to database.');
    return callback(err);
  });
}
