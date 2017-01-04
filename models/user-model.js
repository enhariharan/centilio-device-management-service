var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = Schema({
  // id and timestamp
  uuid: {type: String, required: [true, 'user uuid is required']},
  timestamp: {type: Date, required: [true, 'user creation timestamp is required']},

  // username
  username: {type: String, required: [true, 'username is required']},

  // password
  password: {type: String, required: [true, 'username is required']},
  // TODO: This password should not be stored in plain text.  It should be a BCrypt hash that is stored here.

  // first name
  firstName: {type: String, required: [true, 'user\'s first name is required']},

  // last name
  lastName: {type: String, required: [true, 'user\'s last name is required']},

  // status
  status: {type: Number, required: [true, 'user\'s current status is required']},

  // gender
  gender: String,

  // path to profile pic
  profilePicPath: String,

  // TODO: Add addresses
  // TODO: Add social networks
  // TODO: Add emails
  // TODO: Add contactNumbers
  // TODO: Add link to client
  // TODO: Add link to role
});

// TODO: This validator should be brought back when we know how to do this better.
// // Validator for client.adresses. client.adresses cannot be empty
// clientSchema.path('addresses').validate(function(value){
//   console.log('value.length: ' + value.length);
//   return value.length;
// }, "'addresses' cannot be empty.  Please provide at least one address.");

// TODO: Need validator - at least one email should be provided.
// TODO: Need validator - at least one phone number should be provided.

var addressSchema = Schema({
  client : {type: String, required: 'Client'},

  // address line 1
  line1: {type: String, required: true},

  // address line 2
  line2: String,

  // city
  city: {type: String, required: true},

  // state
  state: String,

  // country code
  countryCode: {type: String, required: true},

  // pin code, zip code
  zipCode: String,

  // GPS coordinates
  latitude: String,
  longitude: String,

  // Address type
  // Can be "work", "home", "present", "permanent", "office 1", ...
  type: {type: String, required: true},

  // Status of this address.
  // can be "active", or "deleted"
  status: String,
});

var emailSchema = Schema({
  client : {type: String, ref: 'Client'},

  // email id
  email : {type: String, required: true},

  // email type
  type: String,
});

var contactNumberSchema = Schema({
  client : {type: String, ref: 'Client'},

  // email id
  number : {type: String, required: true},

  // email type
  type: String,
});

exports.Email   = mongoose.model('Email', emailSchema);
exports.Address = mongoose.model('Address', addressSchema);
exports.ContactNumber = mongoose.model('ContactNumber', contactNumberSchema);
exports.Client  = mongoose.model('Client', clientSchema);
