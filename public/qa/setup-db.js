/*
 * This script is intended to be used by testers or for demo purposes.
 * This script sets up a sample database.
 */
var mongoose = require('mongoose');
var utilities = require('../../models/utilities');
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
   socketOptions: { keepAlive: 1 }
 }
};
mongoose.connect(credentials.mongo.test.connectionString, opts);

var roleUser = new Role(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'user', status: 'active'});
var roleAdmin = new Role(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'admin', status: 'active'});
var roles = [roleUser, roleAdmin];

var deviceTypeMobile = new DeviceType(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'mobile', status: 'active'});
var deviceTypeHomeAppliance = new DeviceType(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'homeAppliance', status: 'active'});
var deviceTypeLight = new DeviceType(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'light', status: 'active'});
var deviceTypeRetired = new DeviceType(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'battery', status: 'retired'});
var deviceTypes = [deviceTypeMobile, deviceTypeHomeAppliance, deviceTypeLight, deviceTypeRetired];

var deviceParamLatitude = new DeviceParam(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'latitude', description: 'latitude of the device position', deviceType: 'all'});
var deviceParamLongitude = new DeviceParam(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'longitude', description: 'longitude of the device position', deviceType: 'all'});
var deviceParamChargingStatus = new DeviceParam(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'charging status', description: 'charging status of the device', deviceType: 'all'});
var deviceParamCurrentCharge = new DeviceParam(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'current charge', description: 'current chare status of the device', deviceType: 'all'});
var deviceParamBrightness = new DeviceParam(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'brightness', description: 'brightness of the device position', deviceType: deviceTypeLight.uuid});
var deviceParamTemperature = new DeviceParam(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), name: 'temperature', description: 'temperature of the device position', deviceType: deviceTypeMobile.uuid});
var deviceParams = [deviceParamLatitude, deviceParamLongitude, deviceParamChargingStatus, deviceParamBrightness, deviceParamTemperature];

var client1corp1 = new Client(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), corporateName: 'corporation 1',   firstName: 'Ashok', lastName: 'Kumar', middleName: 'M', type: 'corporate', role: roleUser.uuid, primaryEmail: 'client1corp1@snigdha.co.in'});
var client2corp1 = new Client(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), corporateName: 'corporation 1',   firstName: 'Mathew', lastName: 'Picard', middleName: 'J', type: 'corporate', role: roleAdmin.uuid, primaryEmail: 'client2corp1@snigdha.co.in'});
var client1corp2 = new Client(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), corporateName: 'corporation 2',   firstName: 'John', lastName: 'Doe', type: 'corporate', role: roleUser.uuid, primaryEmail: 'client1corp2@snigdha.co.in'});
var client2corp2 = new Client(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), corporateName: 'corporation 2',   firstName: 'Jane', lastName: 'Doe', type: 'corporate', role: roleAdmin.uuid, primaryEmail: 'client2corp2@snigdha.co.in'});
var client1retail = new Client(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), corporateName: 'Ashok Kumar',   firstName: 'Ashok', lastName: 'Kumar', type: 'retail', role: roleUser.uuid, primaryEmail: 'client1retail@snigdha.co.in'});
var client2retail = new Client(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), corporateName: 'Kishore Subramanian',   firstName: 'Kishore', lastName: 'Subramanian', type: 'retail', role: roleUser.uuid, primaryEmail: 'client2retail@snigdha.co.in'});
var clientSurya = new Client(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), corporateName: 'Snigdha',   firstName: 'Surya', lastName: 'Vempati', type: 'corporate', role: roleAdmin.uuid, primaryEmail: 'info@snigdha.co.in'});
var clientLydor = new Client(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), corporateName: 'Lydor',   firstName: 'Srinivasa', lastName: 'Reddy', type: 'corporate', role: roleAdmin.uuid, primaryEmail: 'srinivasa.reddy@lydor.in'});
var clientSaiRajesh = new Client(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), corporateName: 'SaiRajesh',   firstName: 'Sai Krishna', lastName: 'Rajesh Narayanan', type: 'corporate', role: roleAdmin.uuid, primaryEmail: 'skotha@gmail.com'});
var clientBabu = new Client(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), corporateName: 'Singdha',   firstName: 'Babu', lastName: 'Choudhary', type: 'corporate', role: roleAdmin.uuid, primaryEmail: 'bnbudiya785@gmail.com'});
var clients = [client1corp1, client2corp1, client1corp2, client2corp2, client1retail, client2retail, clientSurya, clientLydor, clientSaiRajesh, clientBabu];

var device1 = new Device(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), deviceId: '123456789012345',
    name: 'device 1', status: 'online', deviceType: deviceTypeMobile.uuid, client: client1corp1.uuid});
var device2 = new Device(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), deviceId: '234567890123456',
    name: 'device 2', status: 'online', deviceType: deviceTypeMobile.uuid, client: client1corp1.uuid});
var device3 = new Device(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), deviceId: '345678901234567',
    name: 'device 3', status: 'online', deviceType: deviceTypeHomeAppliance.uuid, client: client2corp1.uuid});
var device4 = new Device(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), deviceId: '456789012345678',
    name: 'device 4', status: 'online', deviceType: deviceTypeLight.uuid, client: client1retail.uuid});
var deviceSurya = new Device(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), deviceId: '865980021035123',
    name: 'Surya mobile', status: 'online', deviceType: deviceTypeMobile.uuid, client: clientSurya.uuid});
var deviceBabu = new Device(
  {uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(), deviceId: '911506601398526',
    name: 'Babu mobile', status: 'online', deviceType: deviceTypeMobile.uuid, client: clientBabu.uuid});
var devices = [device1, device2, device3, device4, deviceSurya, deviceBabu];

var address1Client1Corp1 = new Address({client:client1corp1.uuid,
  line1:'123, HiTec City', line2: '', city: 'Hyderabad', state: 'Telangana',
  countryCode: 'IN', zipCode: '500081', latitude: '17.447162', longitude: '78.376808',
  type: 'work', status: 'active'});
var address1Client2Corp1 = new Address({client:client2corp1.uuid,
  line1:'123, HiTec City', line2: '', city: 'Hyderabad', state: 'Telangana',
  countryCode: 'IN', zipCode: '500081', latitude: '17.447162', longitude: '78.376808',
  type: 'work', status: 'active'});
var address2Client2Corp1 = new Address({client:client2corp1.uuid,
  line1:'301, Pushpa apartments', line2: 'Saidabad', city: 'Hyderabad', state: 'Telangana',
  countryCode: 'IN', zipCode: '500059', latitude: '17.357118', longitude: '78.511113',
  type: 'home', status: 'active'});
var address1Client1Corp2 = new Address({client:client1corp2.uuid,
  line1:'123, Example Street', city: 'ExampleCity', state: 'ExampleState',
  countryCode: 'IN', zipCode: '510059', latitude: '21.357118', longitude: '28.511113',
  type: 'work', status: 'active'});
var address1Client2Corp2 = new Address({client:client2corp2.uuid,
  line1:'123, Example Street', city: 'ExampleCity', state: 'ExampleState',
  countryCode: 'IN', zipCode: '510059', latitude: '21.357118', longitude: '28.511113',
  type: 'work', status: 'active'});
var address1Client1retail = new Address({client:client1retail.uuid,
  line1:'123, Example Street', city: 'ExampleCity', state: 'ExampleState',
  countryCode: 'IN', zipCode: '510059', latitude: '21.357118', longitude: '28.511113',
  type: 'work', status: 'active'});
var address2Client1retail = new Address({client:client1retail.uuid,
  line1:'123, Example Street', city: 'ExampleCity', state: 'ExampleState',
  countryCode: 'IN', zipCode: '510059', latitude: '21.357118', longitude: '28.511113',
  type: 'home', status: 'active'});
var address1Client2retail = new Address({client:client2retail.uuid,
  line1:'301, Another Example Street', city: 'ExampleCity', state: 'ExampleState',
  countryCode: 'IN', zipCode: '510059', latitude: '21.357118', longitude: '28.511113',
  type: 'work', status: 'active'});
var address2Client2retail = new Address({client:client2retail.uuid,
  line1:'123, Example Street', city: 'ExampleCity', state: 'ExampleState',
  countryCode: 'IN', zipCode: '510059', latitude: '21.357118', longitude: '28.511113',
  type: 'home', status: 'active'});
var address3Client2retail = new Address({client:client2retail.uuid,
  line1:'123, Example Street', city: 'ExampleCity', state: 'ExampleState',
  countryCode: 'IN', zipCode: '510059', latitude: '21.357118', longitude: '28.511113',
  type: 'home', status: 'deleted'});
var addressSurya = new Address({client:clientSurya.uuid,
  line1:'102, Madhu Residency', line2:'Patrika Nagar', city: 'Hyderabad', state: 'Telangana',
  countryCode: 'IN', zipCode: '500081', latitude: '17.4483', longitude: '78.3915',
  type: 'work', status: 'active'});
var addresses = [address1Client1Corp1, address1Client2Corp1,
  address2Client2Corp1, address1Client1Corp2, address1Client2Corp2,
  address1Client1retail, address2Client1retail, address1Client2retail,
  address2Client2retail, address3Client2retail, addressSurya];

var email1Client1Corp1 = new Email({client:client1corp1.uuid, email: 'client1corp1@snigdha.co.in', type: 'primary'});
var email2Client1Corp1 = new Email({client:client1corp1.uuid, email: 'client.1@corp1.com', type: 'work'});
var email3Client1Corp1 = new Email({client:client1corp1.uuid, email: 'client.1@gmail.com', type: 'personal'});
var email1Client2Corp1 = new Email({client:client2corp1.uuid, email: 'client2corp1@snigdha.co.in', type: 'primary'});
var email1Client1Corp2 = new Email({client:client1corp2.uuid, email: 'client1corp2@snigdha.co.in', type: 'primary'});
var email1Client2Corp2 = new Email({client:client2corp2.uuid, email: 'client2corp2@snigdha.co.in', type: 'primary'});
var email1Client1retail = new Email({client:client1retail.uuid, email: 'client1retail@snigdha.co.in', type: 'primary'});
var email2Client1retail = new Email({client:client1retail.uuid, email: 'client.1@gmail.com', type: 'personal'});
var email1Client2retail = new Email({client:client2retail.uuid, email: 'client2retail@snigdha.co.in', type: 'primary'});
var email2Client2retail = new Email({client:client2retail.uuid, email: 'abc.def@rediffmail.com', type: 'personal'});
var email1Surya = new Email({client:clientSurya.uuid, email: 'info@snigdha.co.in', type: 'primary'});
var email1Lydor = new Email({client:clientSurya.uuid, email: 'srinivasa.reddy@lydor.in', type: 'primary'});
var email1SaiRajesh = new Email({client:clientSurya.uuid, email: 'skotha@gmail.com', type: 'primary'});
var email1Babu = new Email({client:clientBabu.uuid, email: 'bnbudiya785@gmail.com', type: 'primary'});
var emails = [email1Client1Corp1, email2Client1Corp1, email3Client1Corp1,
  email1Client2Corp1, email1Client1Corp2, email1Client2Corp2, email1Client1retail,
  email2Client1retail, email1Client2retail, email2Client2retail, email1Surya, email1Lydor, email1SaiRajesh, email1Babu];

var cn1Client1Corp1 = new ContactNumber({client:client1corp1.uuid, number: '+911234567890', type: 'work'});
var cn1Client2Corp1 = new ContactNumber({client:client2corp1.uuid, number: '+913456789012', type: 'work'});
var cn1Client1Corp2 = new ContactNumber({client:client1corp2.uuid, number: '+912345678901', type: 'work'});
var cn1Client2Corp2 = new ContactNumber({client:client2corp2.uuid, number: '+910123456789', type: 'work'});
var cn1Client1retail = new ContactNumber({client:client1retail.uuid, number: '+911234567890', type: 'work'});
var cn1Client1retail = new ContactNumber({client:client1retail.uuid, number: '+911245567890', type: 'hope'});
var cn1Client1retail = new ContactNumber({client:client1retail.uuid, number: '+911234576890', type: 'fax'});
var cn1Client2retail = new ContactNumber({client:client2retail.uuid, number: '+911234567890', type: 'work'});
var cn2Client2retail = new ContactNumber({client:client2retail.uuid, number: '+912134567890', type: 'airtel'});
var cnSurya = new ContactNumber({client:clientSurya.uuid, number: '+919885608076', type: 'work'});
var clientBabu = new ContactNumber({client:clientBabu.uuid, number: '+919494116895', type: 'work'});
var contactNumbers = [cn1Client1Corp1, cn1Client2Corp1, cn1Client1Corp2,
  cn1Client2Corp2, cn1Client1retail, cn1Client1retail, cn1Client1retail,
  cn1Client2retail, cn2Client2retail, cnSurya];

var userClient1corp1 = new User({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  username: 'userClient1Corp1', password: 'password',
  status: 'activated', gender: 'male', profilePicPath: '//some/example/path',
  client: client1corp1.uuid, role: roleUser.uuid});
var userClient2corp1 = new User({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  username: 'userClient2Corp1', password: 'password',
  status: 'activated', gender: 'female', profilePicPath: '//some/example/path',
  client: client2corp1.uuid, role: roleAdmin.uuid});
var userClient1corp2 = new User({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  username: 'userClient1Corp2', password: 'password',
  status: 'activated', gender: 'female', profilePicPath: '//some/example/path',
  client: client1corp2.uuid, role: roleUser.uuid});
var userClient2corp2 = new User({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  username: 'userClient2corp2', password: 'password',
  status: 'activated', gender: 'male', profilePicPath: '//some/example/path',
  client: client2corp2.uuid, role: roleAdmin.uuid});
var userClient1retail = new User({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  username: 'userClient1retail', password: 'password',
  status: 'activated', gender: 'male', profilePicPath: '//some/example/path',
  client: client1retail.uuid, role: roleUser.uuid});
var userClient2retail = new User({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  username: 'userClient2retail', password: 'password',
  status: 'activated', gender: 'female', profilePicPath: '//some/example/path',
  client: client2retail.uuid, role: roleUser.uuid});
var surya = new User({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  username: 'surya', password: 'password',
  status: 'activated', gender: 'male', profilePicPath: '//some/example/path',
  client: clientSurya.uuid, role: roleAdmin.uuid});
var lydor = new User({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  username: 'lydor', password: 'password',
  status: 'activated', gender: 'male', profilePicPath: '//some/example/path',
  client: clientLydor.uuid, role: roleAdmin.uuid});
var sairajesh = new User({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  username: 'sairajesh', password: 'password',
  status: 'activated', gender: 'male', profilePicPath: '//some/example/path',
  client: clientSaiRajesh.uuid, role: roleAdmin.uuid});
var babu = new User({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  username: 'bnbudiya785@gmail.com', password: 'password',
  status: 'activated', gender: 'male', profilePicPath: '//some/example/path',
  client: clientBabu.uuid, role: roleAdmin.uuid});
var users = [userClient1corp1, userClient2corp1, userClient1corp2, userClient2corp2,
  userClient1retail, userClient2retail, surya, lydor, sairajesh, babu];

var device1Reading1 = new DeviceReading({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  serverTimestamp: utilities.getTimestamp(), device: device1.uuid,
  readings: [{type: 'latitude', value: '100.01'}, {type: 'longitude', value: '100.001'}, {type: 'charging status', value: 'charging'}, {type: 'current charge', value: '80'}]});
var device1Reading2 = new DeviceReading({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  serverTimestamp: utilities.getTimestamp(), device: device1.uuid,
  readings: [{type: 'latitude', value: '100.001'}, {type: 'longitude', value: '100.001'},
  {type: 'charging status', value: 'charging'}, {type: 'current charge', value: '85'}]});
var device1Reading3 = new DeviceReading({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  serverTimestamp: utilities.getTimestamp(), device: device1.uuid,
  readings: [{type: 'latitude', value: '100.001'}, {type: 'longitude', value: '100.001'},
  {type: 'charging status', value: 'charging'}, {type: 'current charge', value: '90'}]});
var device1Reading4 = new DeviceReading({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  serverTimestamp: utilities.getTimestamp(), device: device1.uuid,
  readings: [{type: 'latitude', value: '100.001'}, {type: 'longitude', value: '100.001'},
  {type: 'charging status', value: 'charging'}, {type: 'current charge', value: '95'}]});
var device1Reading5 = new DeviceReading({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  serverTimestamp: utilities.getTimestamp(), device: device1.uuid,
  readings: [{type: 'latitude', value: '100.001'}, {type: 'longitude', value: '100.001'},
  {type: 'charging status', value: 'charging'}, {type: 'current charge', value: '100'}]});
var device2Reading1 = new DeviceReading({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  serverTimestamp: utilities.getTimestamp(), device: device1.uuid,
  readings: [{type: 'latitude', value: '100.001'}, {type: 'longitude', value: '100.001'},
  {type: 'charging status', value: 'discharging'}, {type: 'current charge', value: '100'}]});
var device2Reading2 = new DeviceReading({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  serverTimestamp: utilities.getTimestamp(), device: device1.uuid,
  readings: [{type: 'latitude', value: '100.001'}, {type: 'longitude', value: '100.001'},
  {type: 'charging status', value: 'discharging'}, {type: 'current charge', value: '95'}]});
var device2Reading3 = new DeviceReading({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  serverTimestamp: utilities.getTimestamp(), device: device1.uuid,
  readings: [{type: 'latitude', value: '100.001'}, {type: 'longitude', value: '100.001'},
  {type: 'charging status', value: 'discharging'}, {type: 'current charge', value: '90'}]});
var device2Reading4 = new DeviceReading({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  serverTimestamp: utilities.getTimestamp(), device: device1.uuid,
  readings: [{type: 'latitude', value: '100.001'}, {type: 'longitude', value: '100.001'},
  {type: 'charging status', value: 'discharging'}, {type: 'current charge', value: '85'}]});
var device2Reading5 = new DeviceReading({uuid: utilities.getUuid(), timestamp: utilities.getTimestamp(),
  serverTimestamp: utilities.getTimestamp(), device: device1.uuid,
  readings: [{type: 'latitude', value: '100.001'}, {type: 'longitude', value: '100.001'},
  {type: 'charging status', value: 'discharging'}, {type: 'current charge', value: '75'}]});
var deviceReadings = [
  device1Reading1, device1Reading2, device1Reading3, device1Reading4, device1Reading5,
  device2Reading1, device2Reading2, device2Reading3, device2Reading4, device2Reading5];

var setupRoles = function() {
  return new Promise(function(resolve, reject) {
    roles.forEach(r => { r.save(err => { if (err) reject('error while saving roles.'); }); });
    resolve('all roles saved.');
  });
};

var setupDeviceTypes = function() {
  return new Promise(function(resolve, reject) {
    deviceTypes.forEach(dt => { dt.save(err => { if (err) reject('error while saving device types.'); }); });
    resolve('all device types saved.');
  });
};

var setupClients = function() {
  return new Promise(function(resolve, reject) {
    clients.forEach(c => { c.save(err => { if (err) reject('error while saving clients.'); }); });
    resolve('all clients saved.');
  });
};

var setupUsers = function() {
  return new Promise(function(resolve, reject) {
    users.forEach(u => { u.save(err => { if (err) reject('error while saving users.'); }); });
    resolve('all users saved.');
  });
};

var setupClientAddresses = function() {
  return new Promise(function(resolve, reject) {
    addresses.forEach(a => { a.save(err => { if (err) reject('error while saving addresses.'); }); });
    resolve('all addresses saved.');
  });
};

var setupClientEmails = function() {
  return new Promise(function(resolve, reject) {
    emails.forEach(e => { e.save(err => { if (err) reject('error while saving emails.'); }); });
    resolve('all emails saved.');
  });
};

var setupClientContactNumbers = function() {
  return new Promise(function(resolve, reject) {
    contactNumbers.forEach(cn => { cn.save(err => { if (err) reject('error while saving contact numbers.'); }); });
    resolve('all contact numbers saved.');
  });
};

var setupDevices = function() {
  return new Promise(function(resolve, reject) {
    devices.forEach(d => { d.save(err => { if (err) reject('error while saving devices.'); }); });
    resolve('all devices saved.');
  });
};

var setupDeviceParams = function() {
  return new Promise(function(resolve, reject) {
    deviceParams.forEach(dp => { dp.save(err => { if (err) reject('error while saving device params.'); }); });
    resolve('all device params saved.');
  });
};

var setupDeviceReadings = function() {
  return new Promise(function(resolve, reject) {
    deviceReadings.forEach(dr => { dr.save(err => { if (err) reject('error while saving device readings.'); }); });
    resolve('all device readings saved.');
  });
};

setupRoles()
.then((message) => {console.log(message); return setupDeviceTypes();})
.then((message) => {console.log(message); return setupClients();})
.then((message) => {console.log(message); return setupUsers();})
.then((message) => {console.log(message); return setupClientAddresses();})
.then((message) => {console.log(message); return setupClientEmails();})
.then((message) => {console.log(message); return setupClientContactNumbers();})
.then((message) => {console.log(message); return setupDevices();})
.then((message) => {console.log(message); return setupDeviceParams();})
.then((message) => {console.log(message); return setupDeviceReadings();})
.then((message) => {console.log(message);})
.catch(err => {console.error(err.stack);});

mongoose.connection.close();
