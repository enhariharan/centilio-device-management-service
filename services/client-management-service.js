var Client = require('../models/client-model').Client;
var Address = require('../models/client-model').Address;
var Email = require('../models/client-model').Email;
var ContactNumber = require('../models/client-model').ContactNumber;
var Validator = require('validator');
var RoleManagementService = require('./role-management-service');

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
        var clientDTO = {
          uuid: client.uuid,
          timestamp: client.timestamp,
          corporateName: client.corporateName,
          firstName: client.firstName,
          lastName: client.lastName,
          middleName: client.middleName,
          type: client.type,
          role: client.role,
          addresses: client.addresses,
          emails: client.emails,
          contactNumbers: client.contactNumbers,
        };
        return clientDTO;
      }),
    };
    return callback(0, context);
  });
}

exports.getClient = function(uuid) {
  return _getClient(uuid);
}

exports.getClientByUser = function(user) {
  return _getClientByUser(user);
}

exports.addClient = function(clientDTO, callback) {
  var ClientSaveException = {};

  // validate role.  Cannot be empty and the role must be present in collection "roles"
  if (clientDTO.role === undefined || clientDTO.role === null) {
    console.error("'addresses' cannot be empty.  Please provide at least one address.");
    return callback(400);
  }

  // TODO: There is an issue with validating roles as of now. So uncomment and
  // fix this when needed. As on today role name is not being checked if it is
  // already present in the db. That is dangerous since user can use any role
  // while adding clients.
  //
  // var isRoleValid = RoleManagementService.CheckIfRolePresentByName(client.role);
  // if (!isRoleValid) {
  //   console.error("'role' has a invalid value.  Please provide a valid role.");
  //   return callback(400);
  // }
  //

  // validate adresses.  Cannot be empty, at least one address should be provided.
  if (clientDTO.addresses === undefined || clientDTO.addresses === null || clientDTO.addresses.length === 0) {
    console.error("'addresses' cannot be empty.  Please provide at least one address.");
    return callback(400);
  }

  // validate emails.  Cannot be empty, at least one email should be provided.
  if (clientDTO.emails === undefined || clientDTO.emails === null || clientDTO.emails.length === 0) {
    console.error("'emails' cannot be empty.  Please provide at least one email.");
    return callback(400);
  }
  // TODO: Email address validation must be done. Use Validator.isEmail().

  // validate contact numbers.  Cannot be empty, at least one contact number should be provided.
  if (clientDTO.contactNumbers === undefined || clientDTO.contactNumbers === null || clientDTO.contactNumbers.length === 0) {
    console.error("'contactNumbers' cannot be empty.  Please provide at least one email.");
    return callback(400);
  }
  // TODO: contact number validation must be done Use Validator.isMobilePhone().  Locale must be provided sing the npm module os-local.

  // All validations are done, data looks good to save into DB.
  // So create a new object to save and proceed to save everything
  var clientToSave = new Client({
    uuid: clientDTO.uuid,
    timestamp: clientDTO.timestamp,
    corporateName: clientDTO.corporateName,
    firstName: clientDTO.firstName,
    lastName: clientDTO.lastName,
    middleName: clientDTO.middleName,
    type: clientDTO.type,
    role: clientDTO.role,
  });

  // Save addresses in collection "addresses".
  // TODO: if saving client fails, then every save in addresses must be rolled back also.
  clientDTO.addresses.forEach(function(address) {
    var addressToSave = new Address(address);
    addressToSave.client = clientDTO.uuid;
    addressToSave.save(function(err, address, numAffected) {
      if (err) {
        console.error('Error while saving address to database.');
        return callback(err);
      }
    });
  });

  // Save emails in collection "emails".
  // TODO: if saving client fails, then every save in emails must be rolled back also.
  clientDTO.emails.forEach(function(email) {
    var emailToSave = new Email(email);
    emailToSave.client = clientDTO.uuid;
    emailToSave.save(function(err) {
      if (err) {
        console.error('Error while saving email to database.');
        return callback(err);
      }
    });
  });

  // Save contact numbers in collection "contactNumbers".
  // TODO: if saving client fails, then every save in contactNumbers must be rolled back also.
  clientDTO.contactNumbers.forEach(function(contactNumber) {
    var contactNumberToSave = new ContactNumber(contactNumber);
    contactNumberToSave.client = clientDTO.uuid;
    contactNumberToSave.save(function(err) {
      if (err) {
        console.error('Error while saving contact number to database.');
        return callback(err);
      }
    });
  });

  // Finally save client into collection "emails".
  console.info('clientToSave: ' + clientToSave);
  clientToSave.save(function(err) {
    if (err) {
      console.log('Error while saving client to database.');
      // TODO: if saving client fails, then every save in contactNumbers must be rolled back also.
      // TODO: if saving client fails, then every save in addresses must be rolled back also.
      // TODO: if saving client fails, then every save in emails must be rolled back also.
    } else {
      console.info('client ' + clientToSave.corporateName + ' saved.....');
    }
    return callback(err);
  });
}

var _getClient = function(clientUuid) {
  return new Promise(
    function(resolve, reject) {
      // initialize the query result that will be sent back
      var clientDTO = {
        uuid: '',
        timestamp: null,
        corporateName: '',
        firstName: '',
        lastName: '',
        middleName: '',
        type: '',
        role: '',
        addresses: [],
        emails: [],
        contactNumbers: [],
      };

      // initialize async queries to be done from the database and exectue them
      var findClientQueryPromise = Client.findOne({uuid: clientUuid}).exec();
      var findAllAddressesForClientQueryPromise = Address.find({client: clientUuid}).exec();
      var findAllEmailsForClientQueryPromise = Email.find({client: clientUuid}).exec();
      var findAllContactNumbersForClientQueryPromise = ContactNumber.find({client: clientUuid}).exec();

      // Now get the results of the async queries and collect all results into the result DTO
      findClientQueryPromise.then(
        client => {
          _fillDtoWithClientDetails(clientDTO, client);
          return findAllAddressesForClientQueryPromise;
        }
      ).then(
        addresses => {
          _fillDtoWithClientAdressDetails(clientDTO, addresses);
          return findAllEmailsForClientQueryPromise;
        }
      ).then(
        emails => {
          _fillDtoWithClientEmailDetails(clientDTO, emails);
          return findAllContactNumbersForClientQueryPromise;
        }
      ).then(
        contactNumbers => {
          _fillDtoWithClientContactNumberDetails(clientDTO, contactNumbers);
          console.info('\nclientDTO at the very end ====> : ' + JSON.stringify(clientDTO));
          resolve(clientDTO);
        }
      ).catch(err => { reject(err); });
    }
  );
};

var _fillDtoWithClientDetails = function(clientDTO, client) {
  clientDTO.uuid = client.uuid;
  clientDTO.timestamp = client.timestamp;
  clientDTO.corporateName = client.corporateName;
  clientDTO.firstName = client.firstName;
  clientDTO.lastName = client.lastName;
  clientDTO.middleName = client.middleName;
  clientDTO.type = client.type;
  clientDTO.role = client.role;
}

var _fillDtoWithClientAdressDetails = function(clientDTO, addresses) {
  if (addresses.length != 0) {
    addresses: addresses.map(function(address) {
      clientDTO.addresses.push(address);
    });
  }
}

var _fillDtoWithClientEmailDetails = function(clientDTO, emails) {
  if (emails.length != 0) {
    emails: emails.map(function(email) {
      clientDTO.emails.push(email);
    });
  }
}

var _fillDtoWithClientContactNumberDetails = function(clientDTO, contactNumbers) {
  if (contactNumbers.length != 0) {
    contactNumbers: contactNumbers.map(function(contactNumber) {
      clientDTO.contactNumbers.push(contactNumber);
    });
  }
}

var _getClientByUser = function(username) {
  var user = UserManagementService.getUser({username: username});
  return getClient(user.client);
};
