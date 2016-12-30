var mongoose = require('mongoose');
var Address = require('./address.js');

var clientModel = {
  // id and timestamp
  uuid: String,
  timestamp: Date,

  // corporate name or the retail the person who is signing up
  name: String,

  // Client type. "corporate", "retail", etc.,
  type: String,

  // Addresses of the client
  addresses: [Address],
};

var clientSchema = mongoose.Schema(clientModel);

var Client = mongoose.model('Client', clientSchema);
module.exports = Client;
