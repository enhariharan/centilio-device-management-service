var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DeviceType = require('./device-type-model.js'),
    DeviceType = require('./client-model.js');

var deviceSchema = Schema({
  // unique id and created timestamp
  uuid: {type: String, required: true},
  timestamp: {type: Date, required: true},

  //device identifier given from the device (ex., mobile IMEI)
  deviceId: String,

  // name of the device
  name: String,

  // position of the device
  latitude: String,
  longitude: String,

  // current status of the device - "new", "registered", "activated", "online", "offline", "retired"
  status: {type: String, required: true},

  // device type. stores uuid of device type which must be already present in "devicetypes" collection.
  deviceType: {type: String, ref: 'DeviceType'},

  // client. reference to the client that owns this device.
  client: {type: String, ref: 'Client'},
});

exports.Device = mongoose.model('Device', deviceSchema);
