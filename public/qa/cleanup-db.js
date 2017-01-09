/*
 * This script is intended to be used by testers or for demo purposes.
 * This script cleans up the test database.  It removes all documents from all collections.
 */
var mongoose = require('mongoose'),
    utilities = require('../../models/utilities');
var credentials = require('../../credentials');
var Role = require('../../models/role-model').Role;
var User = require('../../models/user-model').User;
var Client = require('../../models/client-model').Client;
var Address = require('../../models/client-model').Address;
var Email = require('../../models/client-model').Email;
var ContactNumber = require('../../models/client-model').ContactNumber;
var Device = require('../../models/device-model').Device;
var DeviceParam = require('../../models/device-param-model').DeviceParam;
var DeviceReading = require('../../models/device-reading-model').DeviceReading;
var DeviceType = require('../../models/device-type-model').DeviceType;

var opts = {
 server: {
   secketOptions: { keepAlive: 1 }
 }
};
mongoose.connect(credentials.mongo.test.connectionString, opts);

Promise.all([
  Role.remove(),
  User.remove(),
  Client.remove(),
  Address.remove(),
  Email.remove(),
  ContactNumber.remove(),
  Device.remove(),
  DeviceParam.remove(),
  DeviceReading.remove(),
  DeviceType.remove()
])
.then(([roles, users, clients, addresses, emails, contactnumbers, devices,
  deviceparams, devicereadings, devicetypes]) => {
  console.log('roles removed.' + JSON.stringify(roles));
  console.log('users removed.'+ JSON.stringify(users));
  console.log('clients removed.'+ JSON.stringify(clients));
  console.log('addresses removed.'+ JSON.stringify(addresses));
  console.log('emails removed.'+ JSON.stringify(emails));
  console.log('contact numbers removed.'+ JSON.stringify(contactnumbers));
  console.log('devices removed.'+ JSON.stringify(devices));
  console.log('device params removed.'+ JSON.stringify(deviceparams));
  console.log('device readings removed.'+ JSON.stringify(devicereadings));
  console.log('device types removed.'+ JSON.stringify(devicetypes));
})
.catch(err => {console.error('error deleting all documents' + err.stack);});

mongoose.connection.close();
