var mongoose = require('mongoose');
var address = require('./address-model.js');

var clientModel = {
  // id and timestamp
  uuid: {type: String, required: true},
  timestamp: {type: Date, required: true},

  // corporate name or the retail the person who is signing up
  name: {type: String, required: true},

  // Client type. "corporate", "retail", etc.,
  type: {type: String, required: true},
};

var clientSchema = mongoose.Schema(clientModel);
var Client = mongoose.model('Client', clientSchema);
module.exports = Client;
