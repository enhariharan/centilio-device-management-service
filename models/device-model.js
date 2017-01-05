var mongoose = require('mongoose'),
    DeviceType = require('./device-type-model.js'),
    Schema = mongoose.Schema;

var deviceSchema = Schema({
  // unique id and created timestamp
  uuid: {type: String, required: true},
  timestamp: {type: Date, required: true},

  // name of the device
  name: String,

  // position of the device
  latitude: String,
  longitude: String,

  // current status of the device - "new", "registered", "activated", "online", "offline", "retired"
  status: {type: String, required: true},

  // device type. stores uuid of device type which must be aleady present in "devicetypes" collection.
  deviceType: {type: String, ref: 'DeviceType'},
});

var Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
