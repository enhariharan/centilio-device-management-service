var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var deviceSchema = Schema({
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
});

var Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
