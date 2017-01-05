var DeviceParam = require('../models/device-param-model.js'),
    DeviceTypeManagementService = require('./device-type-management-service.js');

exports.getAllDeviceParams = function(callback) {
  DeviceParam.find(function (err, deviceParams) {
    if (err) {
      console.error('error while reading device params from DB = ' + err);
      return callback(err, null);
    }

    if (!deviceParams.length) {
      console.info('No device params found in DB...');
      return callback(0, null);
    }

    var context = {
      deviceParams: deviceParams.map(function(deviceParam) {
        var dev = {
          uuid: deviceParam.uuid,
          timestamp: deviceParam.timestamp,
          name: deviceParam.name,
          latitude: deviceParam.latitude,
          longitude: deviceParam.longitude,
          status: deviceParam.status,
          deviceType: deviceParam.deviceType,
        };
        return dev;
      }),
    };
    return callback(0, context);
  });
}

exports.getDeviceParam = function(uuid, callback) {

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
          latitude: deviceParam.latitude,
          longitude: deviceParam.longitude,
          status: deviceParam.status,
          deviceType: deviceParam.deviceType,
        };
        return dev;
      }),
    };
    return callback(0, context);
  });
}

exports.addDeviceParam = function(deviceParam, callback) {
  console.info('deviceParam: ' + JSON.stringify(deviceParam));
  var deviceParamToSave = new DeviceParam(deviceParam);
  deviceParamToSave.deviceType = deviceParam.deviceType.uuid;
  console.info('deviceParamToSave: ' + JSON.stringify(deviceParamToSave));


  // validate that the deviceType already exists in the devicetypes collection.
  if (deviceParamToSave.deviceType == undefined || deviceParamToSave.deviceType == null) {
        console.log('device param does not have a valid device type.');
        return callback(400);
  }
  console.info('deviceParam.deviceType.uuid: ' + deviceParam.deviceType.uuid);
  DeviceTypeManagementService.getDeviceType(deviceParam.deviceType.uuid, function(err) {
    if (err) {
      console.log('device param does not have a valid device type.');
      return callback(400);
    }
  });

  // Now save new deviceParam into collection "deviceparams"
  deviceParamToSave.save(function(err) {
    if (err) {
      console.log('Error while saving device param to database.');
    }
    return callback(err);
  });
}
