var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var roleSchema = Schema({
  // unique id and created timestamp
  uuid: {type: String, required: true},
  timestamp: {type: Date, required: true},

  // name of the role
  name: {type: String, required: true},

  // current status of the role
  status: {type: String, required: true},
});

exports.Role = mongoose.model('Role', roleSchema);
