var Client = require('../models/client-model.js').Client;
var Address = require('../models/client-model.js').Address;
var Email = require('../models/client-model.js').Email;
var ContactNumber = require('../models/client-model.js').ContactNumber;
var Validator = require('validator');

exports.getAllClients = function(callback) {
  Client.find(function (err, clients) {
    if (err) {
      console.error('error while reading clients from DB = ' + err);
      return callback(err, null);
    }

    if (!clients.length) {
      console.info('No clients found in DB...');
      return callback(0, null);
    }

    var context = {
      clients: clients.map(function(client) {
        var cli = {
          uuid: client.uuid,
          timestamp: client.timestamp,
          name: client.name,
          type: client.type,
        };
        return cli;
      }),
    };
    return callback(0, context);
  });
}

exports.getClient = function(uuid, callback) {

  Client.find({uuid: uuid}, function (err, clients) {
    if (err) {
      console.error('error while reading clients from DB = ' + err);
      return callback(err, null);
    }
    console.info('client: ' + JSON.stringify(clients));

    if (!clients.length) {
      console.error('No clients found in DB...');
      return callback(0, null);
    }

    var context = {
      clients: clients.map(function(client) {
        var cli = {
          uuid: client.uuid,
          timestamp: client.timestamp,
          name: client.name,
          type: client.type,
        };
        return cli;
      }),
    };
    return callback(0, context);
  });
}

exports.addClient = function(client, callback) {
  console.log('client: ' + JSON.stringify(client));
  var ClientSaveException = {};
  var clientToSave = new Client({
    uuid: client.uuid,
    timestamp: client.timestamp,
    name: client.name,
    type: client.type,
    addresses: [],
    emails: []
  });

  // validate adresses.  Cannot be empty, at least one address should be provided.
  if (client.addresses === undefined || client.addresses === null || client.addresses.length === 0) {
    console.error("'addresses' cannot be empty.  Please provide at least one address.");
    return callback(1);
  }

  // validate emails.  Cannot be empty, at least one email should be provided.
  if (client.emails === undefined || client.emails === null || client.emails.length === 0) {
    console.error("'emails' cannot be empty.  Please provide at least one email.");
    return callback(1);
  }
  // TODO: Email address validation must be done. Use Validator.isEmail().

  // validate contact numbers.  Cannot be empty, at least one contact number should be provided.
  if (client.contactNumbers === undefined || client.contactNumbers === null || client.contactNumbers.length === 0) {
    console.error("'contactNumbers' cannot be empty.  Please provide at least one email.");
    return callback(1);
  }
  // TODO: contact number validation must be done Use Validator.isMobilePhone().  Locale must be provided sing the npm module os-local.

  // Save addresses in collection "addresses".
  // TODO: if saving client fails, then every save in addresses must be rolled back also.
  client.addresses.forEach(function(address) {
    var addressToSave = new Address(address);
    addressToSave.client = client.uuid;
    addressToSave.save(function(err) {
      if (err) {
        console.error('Error while saving address to database.');
        return callback(err);
      }
    });
  });

  // Save emails in collection "emails".
  // TODO: if saving client fails, then every save in emails must be rolled back also.
  client.emails.forEach(function(email) {
    var emailToSave = new Email(email);
    emailToSave.client = client.uuid;
    emailToSave.save(function(err) {
      if (err) {
        console.error('Error while saving email to database.');
        return callback(err);
      }
    });
  });

  // Save contact numbers in collection "contactNumbers".
  // TODO: if saving client fails, then every save in contactNumbers must be rolled back also.
  client.contactNumbers.forEach(function(contactNumber) {
    var contactNumberToSave = new ContactNumber(contactNumber);
    contactNumberToSave.client = client.uuid;
    contactNumberToSave.save(function(err) {
      if (err) {
        console.error('Error while saving contact number to database.');
        return callback(err);
      }
    });
  });

  // Finally save client into collection "emails".
  clientToSave.save(function(err) {
    if (err) {
      console.log('Error while saving client to database.');
      // TODO: if saving client fails, then every save in contactNumbers must be rolled back also.
      // TODO: if saving client fails, then every save in addresses must be rolled back also.
      // TODO: if saving client fails, then every save in emails must be rolled back also.
    } else {
      console.info('client ' + client.name + ' saved.....');
    }
    return callback(err);
  });
}
