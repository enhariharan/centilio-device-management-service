var DeviceReading = require('../models/device-reading-model.js').DeviceReading,
    Device = require('../models/device-model.js').Device,
    DeviceReadingManagementService = require('./device-reading-management-service.js');

exports.getAllDeviceReadings = function(callback) {
  DeviceReading.find(function (err, deviceReadings) {
    if (err) {
      console.error('error while reading device readings from DB = ' + err);
      return callback(err, null);
    }

    if (!deviceReadings.length) {
      console.info('No device readings found in DB...');
      return callback(0, null);
    }

    var context = {
      deviceReadings: deviceReadings.map(function(deviceReading) {
        var devReading = {
          uuid: deviceReading.uuid,
          timestamp: deviceReading.timestamp,
          device: deviceReading.device,
          readings: [],
        };
        deviceReading.readings.forEach(function(reading) {
          devReading.readings.push(reading);
        });
        return devReading;
      }),
    };
    return callback(0, context);
  });
}

exports.getDeviceReading = function(uuid, callback) {
  DeviceReading.find({uuid: uuid}, function (err, deviceReadings) {
    if (err) {
      console.error('error while reading device readings from DB = ' + err);
      return callback(err, null);
    }

    if (!deviceReadings.length) {
      console.error('No device readings found in DB...');
      return callback(0, null);
    }

    var context = {
      deviceReadings: deviceReadings.map(function(deviceReading) {
        var devReading = {
          uuid: deviceReading.uuid,
          timestamp: deviceReading.timestamp,
          device: deviceReading.device,
          readings: [],
        };
        deviceReading.readings.forEach(function(reading) {
          devReading.readings.push(reading);
        });
        return devReading;
      }),
    };
    return callback(0, context);
  });
}

exports.addDeviceReading = function(deviceReading, callback) {
  var deviceReadingToSave = new DeviceReading(deviceReading);

  // Validate that the device mentioned in the POST is present in the DB
  if (deviceReading.device === undefined || deviceReading.device === null) {
    console.error('Device uuid not provided in the device reading.');
    return callback(400);
  }
  Device.find({uuid: deviceReading.device}, function(err){
    if (err) {
      console.error('Device uuid was incorrect in the device reading.');
      return callback(400);
    }
  });
  deviceReadingToSave.device = deviceReading.device;

  // Now save new device reading into collection "devicereadings"
  console.error('deviceReadingToSave: ' + JSON.stringify(deviceReadingToSave));
  deviceReadingToSave.save(function(err) {
    if (err) {
      console.log('Error while saving device reading to database.' + err.stack);
    }
    return callback(err);
  });
}

exports.getDeviceReadingsByDeviceUuid = function(deviceUuid, callback) {
  DeviceReading.find({device: deviceUuid}, function (err, deviceReadings) {
    if (err) {
      console.error('error while reading device readings from DB = ' + err);
      return callback(err, null);
    }

    if (!deviceReadings.length) {
      console.error('No device readings found in DB...');
      return callback(0, null);
    }

    var context = {
      deviceReadings: deviceReadings.map( (dr) => {
        var devReading = {
          uuid: dr.uuid,
          timestamp: dr.timestamp,
          device: dr.device,
          readings: [],
        };
        dr.readings.forEach( (r) => {
          devReading.readings.push(r);
        });
        return devReading;
      }),
    };
    console.info('\n returning: ' + JSON.stringify(context));
    return callback(0, context);
  });
}
