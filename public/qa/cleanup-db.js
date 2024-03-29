/*
 * This script is intended to be used by testers or for demo purposes.
 * This script cleans up the test database.  It removes all documents from all collections.
 */
var app = require('express')();
var mongoose = require('mongoose');
var utilities = require('../../src/models/utilities');
var credentials = require('../../src/app/configuration');
var Role = require('../../src/models/role-model').Role;
var User = require('../../src/models/user-model').User;
var Client = require('../../src/models/client-model').Client;
var Address = require('../../src/models/client-model').Address;
var Email = require('../../src/models/client-model').Email;
var ContactNumber = require('../../src/models/client-model').ContactNumber;
var Device = require('../../src/models/device-model').Device;
var DeviceParam = require('../../src/models/device-param-model').DeviceParam;
var DeviceReading = require('../../src/models/device-reading-model').DeviceReading;
var DeviceType = require('../../src/models/device-type-model').DeviceType;
var opts = { server: { socketOptions: { keepAlive: 1 } } };


var printHelp = () => {
  console.log(
    'node cleanup-db.js [OPTIONS]...  \n' +
    'cleans up selected documents from the centilio database. \n' +
    '\n[OPTIONS] \n' +
    '-h [or] --help: Prints this help message \n' +
    '-a [or] --all: Removes all documents from all collections. This is the default option if no other option is provided.\n' +
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

function _createPromises(args, conn) {
  return new Promise((resolve, reject) => {
    var promises = [];
    if (args.length === 0) args.push('--all');
    args.forEach(arg => {
      switch (arg) {
        case '--roles':          promises.push(conn.model('Role').remove()); break;
        case '--users':          promises.push(conn.model('User').remove()); break;
        case '--clients':        promises.push(conn.model('Client').remove()); break;
        case '--addresses':      promises.push(conn.model('Address').remove()); break;
        case '--emails':         promises.push(conn.model('Email').remove()); break;
        case '--contactNumbers': promises.push(conn.model('ContactNumber').remove()); break;
        case '--devices':        promises.push(conn.model('Device').remove()); break;
        case '--deviceParams':   promises.push(conn.model('DeviceParam').remove()); break;
        case '--deviceReadings': promises.push(conn.model('DeviceReading').remove()); break;
        case '--deviceTypes':    promises.push(conn.model('DeviceType').remove()); break;
        case '-a': // fall-through to --all
        case '--all':
          promises.push(conn.model('Role').remove());
          promises.push(conn.model('User').remove());
          promises.push(conn.model('Client').remove());
          promises.push(conn.model('Address').remove());
          promises.push(conn.model('Email').remove());
          promises.push(conn.model('ContactNumber').remove());
          promises.push(conn.model('Device').remove());
          promises.push(conn.model('DeviceParam').remove());
          promises.push(conn.model('DeviceReading').remove());
          promises.push(conn.model('DeviceType').remove());
          break;
        case '-h': // fall-through to --help
        case '--help': // fall-through to default
        default:
          printHelp();
          promises = null;
          break;
      }
    });
    resolve(promises);
  });
};

function _createDbConnection(dbConnection) {
  return new Promise((resolve, reject) => {
    var conn = (!dbConnection || dbConnection === undefined)
    ? mongoose.createConnection(credentials.getDbConnection(app.get('env')), opts)
    : dbConnection;

    conn.on('connecting', () => {console.log('\nconnecting to DB');});
    conn.on('connected', () => {console.log('\nconnected to DB');});
    conn.on('open', () => { console.log('\nopened connection to DB'); });
    conn.on('disconnecting', () => {console.log('\ndisconnecting from DB');});
    conn.on('disconnected', () => {console.log('\ndisconnected from DB');});
    conn.on('close', () => {console.log('\nconnection to DB closed');});
    conn.on('reconnected', () => {console.log('\nreconnected to DB');});
    conn.on('error', (err) => {console.log('\nError raised: ' + err + err.stack);});

    resolve(conn);
  });
}

var cleanupDB = (dbConnection) => {
  return new Promise((resolve, reject) => {
    var args = process.argv.slice(2);

    if (args[0] === '-h' || args[0] === '--help') {
      printHelp();
      process.exit();
    }

    var dbConn = null;
    _createDbConnection(dbConnection)
    .then(conn => {
      dbConn = conn;
      return _createPromises(args, conn);
    })
    .then(promises => { return Promise.all(promises); })
    .then(entities => {
      entities.forEach(e => {console.log('Removed ' + JSON.stringify(e) + ' documents');});
      if (!dbConn || dbConn === undefined) dbConn.close();
      resolve(true);
    })
    .catch(err => {
      console.error('\nerror deleting all documents: ' + err.stack);
      if (!dbConn || dbConn === undefined) dbConn.close();
      reject(err);
    });
  });
};

if (require.main === module) {
  cleanupDB()
  .then(result => { process.exit(); })
  .catch(err => { console.log('\nerror while clearing all recordS'); });
}
else module.exports = {cleanupDB};
