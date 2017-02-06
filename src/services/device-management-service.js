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
        client: d.client,
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
  return new Promise(
    (resolve, reject) => {
      Device.find({uuid: id}).exec().then(devices => {
        if (devices && devices.length !== null && devices.length > 0) return _parseAndSendDevices(devices, callback);
        else return Device.find({deviceId: id}).exec();
      })
      .then(devices => {
        if (devices && devices.length !== null && devices.length > 0) return _parseAndSendDevices(devices, callback);
        else resolve(null);
      })
      .catch(err => { reject(err); });
  });
}

exports.getDevicesByClient = (clientUuid, showAllDevices, showUnassignedDevicesOnly) => {
  return new Promise(
    (resolve, reject) => {
      Client.findOne({uuid: clientUuid}).exec()
      .then(client => {return Role.findOne({uuid: client.role}).exec();})
      .then(role => {
        if ((role.name !== 'admin') && (showAllDevices === 'true')) reject(403);
        if ((role.name !== 'admin') && (showUnassignedDevicesOnly === 'true')) reject(403);
        if ((showAllDevices !== 'true') && (showUnassignedDevicesOnly === 'true')) reject(400);
        if (role.name === 'admin') {
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

exports.getDeviceByUuidAndClientUuid = (deviceUuid, clientUuid) => {
  return new Promise(
    (resolve, reject) => {
      Client.findOne({uuid: clientUuid}).exec()
      .then(client => {
        if (!client || client === undefined) reject(403);
        return Role.findOne({uuid: client.role}).exec();
      })
      .then(role => {
        if (!role) reject(403);
        if (role.name === 'admin') return Device.find({uuid: deviceUuid}).exec();
        else return Device.find({uuid: deviceUuid, client: clientUuid}).exec();
      })
      .then(devices => {resolve(devices[0]);})
      .catch(err => {reject(err);});
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

exports.updateDevice = (device) => {
  return new Promise(
    (resolve, reject) => {
      var deviceToUpdate = {};
      deviceToUpdate.uuid = device.uuid;
      Device.find({uuid: device.uuid}).exec()
      .then(devices => {
        if (device.deviceId !== undefined) deviceToUpdate.deviceId = device.deviceId;
        else if (devices[0].deviceId !== undefined) deviceToUpdate.deviceId = devices[0].deviceId;

        if (device.name !== undefined) deviceToUpdate.name = device.name;
        else if (devices[0].name !== undefined) deviceToUpdate.name = devices[0].name;

        if (device.latitude !== undefined) deviceToUpdate.latitude = device.latitude;
        else if (devices[0].latitude !== undefined) deviceToUpdate.latitude = devices[0].latitude;

        if (device.longitude !== undefined) deviceToUpdate.longitude = device.longitude;
        else if (devices[0].longitude !== undefined) deviceToUpdate.longitude = devices[0].longitude;

        if (device.status !== undefined) deviceToUpdate.status = device.status;
        else if (devices[0].status !== undefined) deviceToUpdate.status = devices[0].status;

        if (device.deviceType !== undefined) deviceToUpdate.deviceType = device.deviceType;
        else if (devices[0].deviceType !== undefined) deviceToUpdate.deviceType = devices[0].deviceType;

        if (device.client !== undefined) deviceToUpdate.client = device.client;
        else if (devices[0].client !== undefined) deviceToUpdate.client = devices[0].client;

        console.log('\ndeviceToUpdate: ' + JSON.stringify(deviceToUpdate));
        return Device.findOneAndUpdate({uuid: device.uuid}, deviceToUpdate, {runValidators: true}).exec();
      })
      .then(info => {resolve(200);})
      .catch(err => {
        console.log('\nerr: ' + JSON.stringify(err));
        reject(err);
      });
  });
};
