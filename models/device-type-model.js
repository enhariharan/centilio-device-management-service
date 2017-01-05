var mongoose = require('mongoose')
    Schema = mongoose.Schema;

var deviceTypeSchema = Schema({
  // unique id and created timestamp
  uuid: {type: String, required: true},
  timestamp: {type: Date, required: true},

  // name of the device
  name: {type: String, required: true},

  // current status of the device - "active", "retired"
  status: {type: String, required: true},
});

var DeviceType = mongoose.model('DeviceType', deviceTypeSchema);
module.exports = DeviceType;
