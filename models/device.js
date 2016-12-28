var mongoose = require('mongoose');

var deviceSchema = mongoose.Schema({
  uuid: String,
  name: String,
  latitude: String,
  longitude: String,
  status: String,
});

var Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
