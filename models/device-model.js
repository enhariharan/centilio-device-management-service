var mongoose = require('mongoose');

var deviceModel = {
  // unique id and created timestamp
  uuid: String,
  timestamp: Date,

  // name of the device
  name: String,

  // position of the device
  latitude: String,
  longitude: String,

  // current status of the device - "new", "registered", "activated", "online", "offline", "retired"
  status: String,
}

var deviceSchema = mongoose.Schema(deviceModel);

var Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
