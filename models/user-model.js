var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Client = require('./client-model.js'),
    Role = require('./role-model.js');

var userSchema = Schema({
  // id and timestamp
  uuid: {type: String, required: [true, 'user uuid is required']},
  timestamp: {type: Date, required: [true, 'user creation timestamp is required']},

  // username
  username: {type: String, required: [true, 'username is required']},

  // password
  password: {type: String, required: [true, 'username is required']},
  // TODO: This password should not be stored in plain text.  It should be a BCrypt hash that is stored here.

  // status - 'new user' (no email activation done),
  //          'registered' (email activation completed),
  //          'activated' (linked to a client profile),
  //          'deleted' (username marked as deleted)
  status: {type: String, required: [true, 'user\'s current status is required']},

  // gender
  gender: String,

  // path to profile pic
  profilePicPath: String,

  // TODO: Add social networks

  // client - client uuid is stored as reference
  client: {type: String, ref: 'Client'},

  // role
  role: {type: String, ref: 'Role'},
});

exports.User = mongoose.model('User', userSchema);
