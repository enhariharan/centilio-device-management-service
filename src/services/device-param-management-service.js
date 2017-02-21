var DeviceParam = require('../models/device-param-model').DeviceParam,
    DeviceTypeManagementService = require('./device-type-management-service');

exports.getAllDeviceParams = (callback) => {
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

exports.getDeviceParamsByDeviceUuid = (uuid, callback) => {
  "use strict";

  DeviceParam.find({uuid: uuid}, function (err, deviceParams) {
    if (err) {
      console.error('error while reading device params from DB = ' + err);
      return callback(err, null);
    }

    if (!deviceParams.length) {
      console.error('No device params found in DB...');
      return callback(0, null);
    }

    var context = {
      deviceParams: deviceParams.map(function(deviceParam) {
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

exports.addDeviceParam = (deviceParam) => {
  return new Promise(
    (resolve, reject) => {
      var deviceParamToSave = new DeviceParam(deviceParam);

      // validate that the deviceType already exists in the devicetypes collection.
      if (!deviceParamToSave.deviceType || deviceParamToSave.deviceType === undefined) reject(400);
      DeviceTypeManagementService.getDeviceType(deviceParam.deviceType.uuid)
      .then(deviceType => { return deviceParamToSave.save() })
      .then(deviceParam => { resolve(deviceParam); })
      .catch(err => { reject(err); });
  });
}
