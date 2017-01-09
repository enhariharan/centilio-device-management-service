var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DeviceType = require('./device-type-model.js');

var deviceParamSchema = Schema({
  // unique id and created timestamp
  uuid: {type: String, required: true},
  timestamp: {type: Date, required: true},

  // name of the device parameter
  name: {type: String, required: true},

  // description of the device parameter
  description: {type: String, required: true},

  // device type. stores uuid of device type which must be aleady present in "devicetypes" collection.
  // optional field to store which type of device provides this param.
  // if this field is not given then this device param would be considered applicable for all device types.
  deviceType: {type: String, ref: 'DeviceType'},
});

exports.DeviceParam = mongoose.model('DeviceParam', deviceParamSchema);
