var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Device = require('./device-model.js'),
    DeviceParam = require('./device-param-model.js');

var deviceReadingSchema = Schema({
  // unique id, created timestamp and saved timestamp.
  uuid: {type: String, required: true}, // This is set at the server side and should not be set by the device
  timestamp: {type: Date, required: true}, // This is set by the device sending the reading
  serverTimestamp:  {type: Date, required: true}, // This is set by the server at the time of persisting into the db

  // device - reference to the device whose readings are beings stored.
  device: {type: String, ref: 'Device'},

  // array of readings from the device
  readings: [{
    // uuid of the device param.  This uuid must map to a valid device param in the collection "deviceparams".
    // This identifies the particular reading - latitude, longitude, temperature, ...
    type: {type: String, ref: 'DeviceParam'},

    // value of the device param.
    value: {type: String, required: true},
  }],
});

exports.DeviceReading = mongoose.model('DeviceReading', deviceReadingSchema);
