var DeviceReading = require('../models/device-reading-model.js'),
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
  console.info('deviceReading: ' + JSON.stringify(deviceReading));
  var deviceReadingToSave = new DeviceReading(deviceReading);
  console.info('deviceReadingToSave: ' + JSON.stringify(deviceReadingToSave));

  // Now save new device reading into collection "devicereadings"
  deviceReadingToSave.save(function(err) {
    if (err) {
      console.log('Error while saving device reading to database.');
    }
    return callback(err);
  });
}
