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
    'node cleanup-db.js [OPTIONS]...  \n\
    cleans up selected documents from the centilio database. \n\
    \n\
    [OPTIONS] \n\
    --help: Prints this help message \n\
    --all: Removes all documents from all collections. This is the default option if no other option is provided.\n\
    --addresses: Removes all documents in addresses collection.\n\
    --clients: Removes all documents in clients collection.\n\
    --contactNumbers: Removes all documents in contactNumbers collection.\n\
    --devices: Removes all documents in devices collection.\n\
    --deviceParams: Removes all documents in deviceParams collection.\n\
    --deviceReadings: Removes all documents in deviceReadings collection.\n\
    --deviceTypes: Removes all documents in deviceTypes collection.\n\
    --emails: Removes all documents in emails collection.\n\
    --roles: Removes all documents in roles collection.\n\
    --users: Removes all documents in users collection.\n\
    \n\
    [EXAMPLE USAGE] \n\
    1. node cleanup-data.js --all \n\
    Removes all documents from all collections. \n\
    \n\
    2. node cleanup-data.js \n\
    Removes all documents from all collections. \n\
    \n\
    3. node cleanup-data.js --deviceReadings \n\
    Removes all documents from deviceReadings only while keeping all other collections intact. \n\
    \n\
    4. node cleanup-data.js --clients --contactNumbers \n\
    Removes all documents from clients and contactNumbers collections only. \n\
    \n\
    5. node cleanup-data.js --help \n\
    Displays this help message. \n\
    \n\
    6. node cleanup-data.js --xyz \n\
    Unknown option. Displays this help message. \n\
    \n\
  ');
}

mongoose.connect(credentials.mongo.test.connectionString, opts);

var promises = [];
var args = process.argv.slice(2);

if (args.length === 0) {console.log('+args: ' + args); args.push('--all'); console.log('-args: ' + args); }

args.forEach(arg => {
  switch (arg) {
    case '--all':
    case '--roles': promises.push(Role.remove()); if (arg === '--roles') break;
    case '--users': promises.push(User.remove()); if (arg === '--users') break;
    case '--clients': promises.push(Client.remove()); if (arg === '--clients') break;
    case '--addresses': promises.push(Address.remove()); if (arg === '--addresses') break;
    case '--emails': promises.push(Email.remove()); if (arg === '--emails') break;
    case '--contactNumbers': promises.push(ContactNumber.remove()); if (arg === '--contactNumbers') break;
    case '--devices': promises.push(Device.remove()); if (arg === '--devices') break;
    case '--deviceParams': promises.push(DeviceParam.remove()); if (arg === '--deviceParams') break;
    case '--deviceReadings': promises.push(DeviceReading.remove()); if (arg === '--deviceReadings') break;
    case '--deviceTypes': promises.push(DeviceType.remove()); if (arg === '--deviceTypes') break;
    case '--help': if (arg === '--all') break;
    default: printHelp(); process.exit();
  }
});

Promise.all(promises)
.then(entities => {
  entities.forEach(e => {console.log('Removed ' + JSON.stringify(e) + ' documents');})
})
.catch(err => {console.error('error deleting all documents' + err.stack);});

mongoose.connection.close();
