var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Device = require('./device-model.js'),
    DeviceParam = require('./device-param-model.js');

var deviceReadingSchema = Schema({
  // unique id and created timestamp.
  uuid: {type: String, required: true},
  timestamp: {type: Date, required: true},

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
