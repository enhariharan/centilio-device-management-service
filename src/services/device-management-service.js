var Device = require('../models/device-model').Device,
    Client = require('../models/client-model').Client,
    Role = require('../models/role-model').Role,
    Utilities = require('../models/utilities'),
    DeviceTypeManagementService = require('./device-type-management-service');

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

exports.getDevice = (id) => {
  return new Promise(
    (resolve, reject) => {
      Device.findOne({uuid: id}).exec()
      .then(device => {
        if (device && device !== undefined) resolve(device);
        return Device.findOne({deviceId: id}).exec();
      })
      .then(device => {
        if (device && device !== undefined) resolve(device);
        else resolve(null);
      })
      .catch(err => { reject(err); });
  });
}

exports.getDevicesByClient = (clientUuid, options) => {
  return new Promise(
    (resolve, reject) => {
      var isShowAllDevicesOptionPresent = (options !== undefined) && (options.showAllDevices === 'true');
      var isShowUnassignedDevicesOnlyPresent = (options !== undefined) && (options.showUnassignedDevicesOnly === 'true');
      var isShowRetiredDevicesOnlyPresent = (options !== undefined) && (options.showRetiredDevices === 'true');

      Client.findOne({uuid: clientUuid}).exec()
      .then(client => {return Role.findOne({uuid: client.role}).exec();})
      .then(role => {
        var isRoleAdmin = (role.name === 'admin');
        if (!isRoleAdmin && isShowAllDevicesOptionPresent) reject(403);
        if (!isRoleAdmin && isShowUnassignedDevicesOnlyPresent) reject(403);
        if (!isShowAllDevicesOptionPresent && isShowUnassignedDevicesOnlyPresent) reject(400);

        if (isRoleAdmin) {
          if (isShowAllDevicesOptionPresent) {
            if (isShowUnassignedDevicesOnlyPresent) {
              if (isShowRetiredDevicesOnlyPresent) return Device.find({client: {$exists: false}}).exec();
              else return Device.find({client: {$exists: false}, status: {$ne: 'retired'}}).exec();
            } else {
              if (isShowRetiredDevicesOnlyPresent) return Device.find().exec();
              else return Device.find({status: {$ne: 'retired'}}).exec();
            }
          } else {
            if (isShowRetiredDevicesOnlyPresent) return Device.find().exec();
            else return Device.find({status: {$ne: 'retired'}}).exec();
          }
        } else {
          if (isShowRetiredDevicesOnlyPresent) return Device.find({client: clientUuid}).exec();
          else return Device.find({client: clientUuid, status: {$ne: 'retired'}}).exec();
        }
      })
      .then(devices => {
        if (!devices || devices === undefined || !devices.length) {
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
        console.log('error occurred while reading devices by client: ' + err.stack);
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

exports.addDevice = (device) => {
  return new Promise(
    (resolve, reject) => {
      if (device.deviceType === undefined || !device.deviceType) {
        console.log('device does not have a valid device type.');
        reject(400);
      }
      if (device.uuid === undefined || !device.uuid || device.deviceId === undefined || !device.deviceId) {
        console.log('device does not have a valid uuid and valid deviceId.');
        reject(400);
      }

      this.getDevice(device.uuid)
      .then(foundDevice => {
        if (foundDevice && foundDevice !== undefined) {
          console.log('device with given uuid (%s) is already present.', foundDevice.uuid);
          reject(400);
        }
        return this.getDevice(device.deviceId);
      })
      .then(foundDevice => {
        if (foundDevice && foundDevice !== undefined) {
          console.log('device with given deviceId (%s) is already present.', foundDevice.deviceId);
          reject(400);
        }
        return DeviceTypeManagementService.getDeviceType(device.deviceType)
      })
      .then(deviceType => {
        // A hack: It is assumed that device.deviceType will contain wither a UUID or the device name.
        // device uuid will be provided in almost all cases but device name will be provided when user
        // adds a new device with a new device type. Hence, this below logic
        // What does it do? It checks the collection DeviceType for a document with the given UUID. If not found
        // then it is assumed that device.deviceType is a new device type and so a new document is added to
        // the devicetype collection.
        if (!deviceType || deviceType === undefined) {
          // create a new device type document and add to devicetype collection
          var newDeviceType = {
            uuid: Utilities.getUuid(),
            timestamp: Utilities.getTimestamp(),
            name: device.deviceType,
            status: 'active' };
          return DeviceTypeManagementService.addDeviceType(newDeviceType);
        } else return deviceType; // return existing deviceType document
      })
      .then(deviceType => {
        var deviceToSave = new Device(device);
        deviceToSave.deviceType = device.deviceType;
        return deviceToSave.save();
      })
      .then( savedDevice => {
        console.info('saved new device (%s) of type (%s).', savedDevice.name, savedDevice.deviceType);
        resolve(savedDevice);
      })
      .catch(err => {
        console.error('Error while saving device to database.' + err.stack);
        reject(err);
      });
  });
}

exports.updateDevice = (device) => {
  return new Promise(
    (resolve, reject) => {
      var deviceToUpdate = {};
      deviceToUpdate.uuid = device.uuid;
      Device.findOne({uuid: device.uuid}).exec()
      .then(foundDevice => {
        if (device.deviceId !== undefined) deviceToUpdate.deviceId = device.deviceId;
        else if (foundDevice.deviceId !== undefined) deviceToUpdate.deviceId = foundDevice.deviceId;

        if (device.name !== undefined) deviceToUpdate.name = device.name;
        else if (foundDevice.name !== undefined) deviceToUpdate.name = foundDevice.name;

        if (device.latitude !== undefined) deviceToUpdate.latitude = device.latitude;
        else if (foundDevice.latitude !== undefined) deviceToUpdate.latitude = foundDevice.latitude;

        if (device.longitude !== undefined) deviceToUpdate.longitude = device.longitude;
        else if (foundDevice.longitude !== undefined) deviceToUpdate.longitude = foundDevice.longitude;

        if (device.status !== undefined) deviceToUpdate.status = device.status;
        else if (foundDevice.status !== undefined) deviceToUpdate.status = foundDevice.status;

        if (device.deviceType !== undefined) deviceToUpdate.deviceType = device.deviceType;
        else if (foundDevice.deviceType !== undefined) deviceToUpdate.deviceType = foundDevice.deviceType;

        if (device.client !== undefined) deviceToUpdate.client = device.client;
        else if (foundDevice.client !== undefined) deviceToUpdate.client = foundDevice.client;

        console.log('\ndeviceToUpdate: ' + JSON.stringify(deviceToUpdate));
        return Device.findOneAndUpdate({uuid: device.uuid}, deviceToUpdate, {runValidators: true}).exec();
      })
      .then(info => { resolve(200); })
      .catch(err => { reject(err); });
  });
};
