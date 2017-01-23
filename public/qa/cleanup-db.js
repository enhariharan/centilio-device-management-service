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
   socketOptions: { keepAlive: 1 }
 }
};


var printHelp = () => {
  console.log(
    'node cleanup-db.js [OPTIONS]...  \n' +
    'cleans up selected documents from the centilio database. \n' +
    '\n [OPTIONS] \n' +
    '--help: Prints this help message \n' +
    '--all: Removes all documents from all collections. This is the default option if no other option is provided.\n' +
    '--addresses: Removes all documents in addresses collection.\n' +
    '--clients: Removes all documents in clients collection.\n' +
    '--contactNumbers: Removes all documents in contactNumbers collection.\n' +
    '--devices: Removes all documents in devices collection.\n' +
    '--deviceParams: Removes all documents in deviceParams collection.\n' +
    '--deviceReadings: Removes all documents in deviceReadings collection.\n' +
    '--deviceTypes: Removes all documents in deviceTypes collection.\n' +
    '--emails: Removes all documents in emails collection.\n' +
    '--roles: Removes all documents in roles collection.\n' +
    '--users: Removes all documents in users collection.\n' +
    '\n[EXAMPLE USAGE] \n' +
    '1. node cleanup-data.js --all \n' +
    'Removes all documents from all collections. \n' +
    '2. node cleanup-data.js \n' +
    'Removes all documents from all collections. \n' +
    '3. node cleanup-data.js --deviceReadings \n' +
    'Removes all documents from deviceReadings only while keeping all other collections intact. \n' +
    '4. node cleanup-data.js --clients --contactNumbers \n' +
    'Removes all documents from clients and contactNumbers collections only. \n' +
    '5. node cleanup-data.js --help \n' +
    'Displays this help message. \n' +
    '6. node cleanup-data.js --xyz \n' +
    'Unknown option. Displays this help message. \n'
  );
};

mongoose.connect(credentials.mongo.test.connectionString, opts);

var promises = [];
var args = process.argv.slice(2);

if (args.length === 0) {console.log('+args: ' + args); args.push('--all'); console.log('-args: ' + args); }

args.forEach(arg => {
  switch (arg) {
    case '--roles': promises.push(Role.remove()); break;
    case '--users': promises.push(User.remove()); break;
    case '--clients': promises.push(Client.remove()); break;
    case '--addresses': promises.push(Address.remove()); break;
    case '--emails': promises.push(Email.remove()); break;
    case '--contactNumbers': promises.push(ContactNumber.remove()); break;
    case '--devices': promises.push(Device.remove()); break;
    case '--deviceParams': promises.push(DeviceParam.remove()); break;
    case '--deviceReadings': promises.push(DeviceReading.remove()); break;
    case '--deviceTypes': promises.push(DeviceType.remove()); break;
    case '--help': printHelp(); process.exit(); break;
    case '--all':
      promises.push(Role.remove());
      promises.push(User.remove());
      promises.push(Client.remove());
      promises.push(Address.remove());
      promises.push(Email.remove());
      promises.push(ContactNumber.remove());
      promises.push(Device.remove());
      promises.push(DeviceParam.remove());
      promises.push(DeviceReading.remove());
      promises.push(DeviceType.remove());
      break;
    default: printHelp(); process.exit();
  }
});

Promise.all(promises)
.then(entities => {
  entities.forEach(e => {console.log('Removed ' + JSON.stringify(e) + ' documents');});
})
.catch(err => {console.error('error deleting all documents' + err.stack);});

mongoose.connection.close();
