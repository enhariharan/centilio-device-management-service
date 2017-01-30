var DeviceReading = require('../models/device-reading-model').DeviceReading,
    Device = require('../models/device-model').Device,
    DeviceReadingManagementService = require('./device-reading-management-service');

exports.getAllDeviceReadings = (callback) => {
  DeviceReading.find({}).sort('-timestamp').exec((err, deviceReadings) => {
    if (err) {
      console.error('error while reading device readings from DB = ' + err);
      return callback(err, null);
    }

    if (!deviceReadings.length) {
      console.info('No device readings found in DB...');
      return callback(0, null);
    }

    var context = {
      deviceReadings: deviceReadings.map(dr => {
        var devReading = {
          uuid: dr.uuid,
          timestamp: dr.timestamp,
          device: dr.device,
          readings: [],
        };
        dr.readings.forEach(r => {devReading.readings.push(r);});
        return devReading;
      }),
    };
    return callback(0, context);
  });
}

exports.getDeviceReading = (uuid, callback) => {
  DeviceReading.find({uuid: uuid}).exec((err, deviceReadings) => {
    if (err) {
      console.error('error while reading device readings from DB = ' + err);
      return callback(err, null);
    }

    if (!deviceReadings.length) {
      console.error('No device readings found in DB...');
      return callback(0, null);
    }

    var context = {
      deviceReadings: deviceReadings.map(dr => {
        var devReading = {
          uuid: dr.uuid,
          timestamp: dr.timestamp,
          device: dr.device,
          readings: [],
        };
        dr.readings.forEach(r => {devReading.readings.push(r);});
        return devReading;
      }),
    };
    return callback(0, context);
  });
}

exports.addDeviceReading = (deviceReading, callback) => {
  var deviceReadingToSave = new DeviceReading(deviceReading);

  // Validate that the device mentioned in the POST is present in the DB
  if (deviceReading.device === undefined || deviceReading.device === null) {
    console.error('Device uuid not provided in the device reading.');
    return callback(400);
  }
  Device.find({uuid: deviceReading.device}, (err) => {
    if (err) {
      console.error('Device uuid was incorrect in the device reading.');
      return callback(400);
    }
  });
  deviceReadingToSave.device = deviceReading.device;

  // Now save new device reading into collection "devicereadings"
  console.error('\ndeviceReadingToSave: ' + JSON.stringify(deviceReadingToSave));
  deviceReadingToSave.save((err) => {
    if (err) console.log('Error while saving device reading to database.' + err.stack);
    return callback(err);
  });
}

exports.getDeviceReadingsByDeviceUuid = (deviceUuid, showLatestOnly, fromTimeStamp, toTimeStamp) => {
  return new Promise(
    (resolve, reject) => {
      var deviceReadingsPromise = null;
      var fromTime = new Date('2017-01-01T00:00:00');
      var toTime = new Date();

      if (showLatestOnly) deviceReadingsPromise = DeviceReading.findOne({device: deviceUuid}).sort('-timestamp').exec();
      else {
        if (fromTimeStamp !== undefined) fromTime = new Date(new Number(fromTimeStamp));
        if (toTimeStamp !== undefined) toTime = new Date(new Number(toTimeStamp));
        deviceReadingsPromise = DeviceReading.find({device: deviceUuid, timestamp: {$gte: new Date(fromTime), $lte: new Date(toTime)}}).sort('-timestamp').exec();
      }

      deviceReadingsPromise.then(deviceReadings => {

        if (!deviceReadings || deviceReadings.length == 0) resolve(null); // no deviceReadings found
        if (deviceReadings.length == undefined) resolve(deviceReadings); // only one deviceReading returned

        var context = {
          deviceReadings: deviceReadings.map( (dr) => {
            var devReading = {
              uuid: dr.uuid,
              timestamp: dr.timestamp,
              device: dr.device,
              readings: [],
            };
            dr.readings.forEach( (r) => {devReading.readings.push(r);});
            return devReading;
          }),
        };
        console.info('\n returning deviceReadings: ' + JSON.stringify(context));
        resolve(context);
      })
      .catch(err => {
        console.info('\n err: ' + JSON.stringify(err));
        reject(err);
    });
  });
}

exports.getAllDeviceReadingsByDevices = (devices, showLatestOnly, fromTimeStamp, toTimeStamp) => {
  return new Promise(
    (resolve, reject) => {
      var deviceReadingsPromises = [];
      var fromTime = new Date('2017-01-01T00:00:00');
      var toTime = new Date();
      devices.forEach( d => {
        if (showLatestOnly) deviceReadingsPromises.push(DeviceReading.findOne({device: d.uuid}).sort('-timestamp').exec());
        else {
          if (fromTimeStamp !== undefined) fromTime = new Date(new Number(fromTimeStamp));
          if (toTimeStamp !== undefined) toTime = new Date(new Number(toTimeStamp));
          deviceReadingsPromises.push(DeviceReading.find({device: d.uuid, timestamp: {$gte: fromTime, $lte: toTime}}).sort('-timestamp').exec());
        }
      });
      Promise.all(deviceReadingsPromises).then(readings => {resolve(readings);});
  });
}
