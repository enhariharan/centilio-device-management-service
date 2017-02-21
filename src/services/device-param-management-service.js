var DeviceParam = require('../models/device-param-model').DeviceParam,
    DeviceTypeManagementService = require('./device-type-management-service'),
    DeviceManagementService = require('./device-management-service');

exports.getAllDeviceParams = (callback) => {
  "use strict";

  DeviceParam.find((err, deviceParams) => {
    if (err) {
      console.error('error while reading device params from DB = ' + err);
      return callback(err, null);
    }

    if (!deviceParams.length) {
      console.info('No device params found in DB...');
      return callback(0, null);
    }

    var context = {
      deviceParams: deviceParams.map((deviceParam) => {
        var dev = {
          uuid: deviceParam.uuid,
          timestamp: deviceParam.timestamp,
          name: deviceParam.name,
          deviceType: deviceParam.deviceType,
          description: deviceParam.description,
          category: deviceParam.category,
        };
        return dev;
      }),
    };
    return callback(0, context);
  });
}

exports.getDeviceParam = (uuid, callback) => {
  "use strict";

  DeviceParam.find({uuid: uuid}, (err, deviceParams) => {
    if (err) {
      console.error('error while reading device params from DB = ' + err);
      return callback(err, null);
    }

    if (!deviceParams.length) {
      console.error('No device params found in DB...');
      return callback(0, null);
    }

    var context = {
      deviceParams: deviceParams.map((deviceParam) => {
        var dev = {
          uuid: deviceParam.uuid,
          timestamp: deviceParam.timestamp,
          name: deviceParam.name,
          deviceType: deviceParam.deviceType,
          description: deviceParam.description,
          category: deviceParam.category,
        };
        return dev;
      }),
    };
    return callback(0, context);
  });
}

exports.getDeviceParamsByDeviceUuid = (deviceUuid) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      DeviceManagementService.getDevice(deviceUuid)
      .then(device => {
        console.log('\ndevice: %s', JSON.stringify(device));

        if (!device || device === undefined) reject(400); // invalid device id

        // match all params with given deviceType of the device or deviceType "all"
        return DeviceParam.find({deviceType: {$in: [device.deviceType, 'all']}});
      })
      .then(foundDeviceParams => { resolve(foundDeviceParams); })
      .catch(err => { reject(err); });
  });
}

exports.addDeviceParam = (deviceParam) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      var deviceParamToSave = new DeviceParam(deviceParam);

      // validate that the deviceType already exists in the devicetypes collection.
      if (!deviceParamToSave.deviceType || deviceParamToSave.deviceType === undefined) reject(400);
      DeviceTypeManagementService.getDeviceType(deviceParam.deviceType.uuid)
      .then(deviceType => {
        if (!deviceType || deviceType === undefined) reject(400); // invalid deviceType sent
        return deviceParamToSave.save();
      })
      .then(deviceParam => { resolve(deviceParam); })
      .catch(err => { reject(err); });
  });
}
