var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var clientSchema = Schema({
  // id and timestamp
  uuid: {type: String, required: [true, 'client uuid is required']},
  timestamp: {type: Date, required: [true, 'creation timestamp is required']},

  // corporate name or the retail the person who is signing up
  name: {type: String, required: [true, 'corporate name is required']},

  // Client type. "corporate", "retail", etc.,
  type: {type: String, required: [true, 'client type is required']},

  // Addresses
  addresses: [{ type: String, ref: 'Address'}],

  // emails
  emails: [{ type: String, ref: 'Email'}]
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
  client : {type: String, ref: 'Client'},

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
