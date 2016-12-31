var mongoose = require('mongoose');

var addressModel = {
  // id and timestamp
  uuid: String,
  timestamp: Date,

  // address line 1
  line1: String,

  // address line 2
  line2: String,

  // city
  city: String,

  // state
  state: String,

  // country code
  countryCode: String,

  // pin code, zip code
  zipCode: String,

  // GPS coordinates
  latitude: String,
  longitude: String,

  // Address type
  // Can be "work", "home", "present", "permanent", "office 1", ...
  type: String,

  // Status of this address.
  // can be "active", or "deleted"
  status: String,
};

var AddressSchema = mongoose.Schema(addressModel);
var Address = mongoose.model('Address', addressSchema);
module.exports = {AddressSchema};  // intentionally not exporting AddressModel
                                   // since AddressSchema is used embedded in
                                   // cient-model
