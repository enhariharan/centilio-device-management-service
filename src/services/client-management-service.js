var BasicAuth = require('basic-auth'),
    Client = require('../models/client-model').Client,
    User = require('../models/user-model').User,
    Address = require('../models/client-model').Address,
    Email = require('../models/client-model').Email,
    ContactNumber = require('../models/client-model').ContactNumber,
    Device = require('../models/device-model').Device,
    Role = require('../models/role-model').Role,
    Validator = require('validator'),
    RoleManagementService = require('./role-management-service'),
    UserManagementService = require('./user-management-service'),
    Errors = require('../security/errors').errors;

var getAllClients = () => {
  return new Promise(
    (resolve, reject) => {
      Client.find()
      .then(clients => { resolve(clients); })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
}

var getAllClientsByCorporate = (orgName) => {
  return new Promise(
    (resolve, reject) => {
      Client.find({'corporateName': orgName}).exec()
      .then( clients => {
        if (!clients.length) resolve(0, null);
        resolve(clients);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
}

var getClient = (clientUuid) => {
  return new Promise(
    (resolve, reject) => {
      // initialize the query result that will be sent back
      var clientDTO = { uuid: '',
        timestamp: null,
        corporateName: '',
        firstName: '',
        lastName: '',
        middleName: '',
        type: '',
        role: '',
        primaryEmail: '',
        addresses: [],
        emails: [],
        contactNumbers: [],
        devices: [],
       };

      // initialize async queries to be done from the database and exectue them
      var findClientQueryPromise = Client.findOne({uuid: clientUuid}).exec();
      var findAllAddressesForClientQueryPromise = Address.find({client: clientUuid}).exec();
      var findAllEmailsForClientQueryPromise = Email.find({client: clientUuid}).exec();
      var findAllContactNumbersForClientQueryPromise = ContactNumber.find({client: clientUuid}).exec();
      var findAllDevicesForClientQueryPromise = Device.find({client: clientUuid}).exec();

      // Now get the results of the async queries and collect all results into the result DTO
      findClientQueryPromise
      .then(client => {
        if (!client || client === undefined) throw(Errors.invalidClientUuid);
        _fillDtoWithClientDetails(clientDTO, client);
        return Role.findOne({uuid: client.role}).exec();
      })
      .then(role => {
        clientDTO.role = role.name;
        return findAllAddressesForClientQueryPromise;
      })
      .then(addresses => {
        _fillDtoWithClientAdressDetails(clientDTO, addresses);
        return findAllEmailsForClientQueryPromise;
      })
      .then(emails => {
        _fillDtoWithClientEmailDetails(clientDTO, emails);
        return findAllContactNumbersForClientQueryPromise;
      })
      .then(contactNumbers => {
        _fillDtoWithClientContactNumberDetails(clientDTO, contactNumbers);
        return findAllDevicesForClientQueryPromise;
      })
      .then(devices => {
        _fillDtoWithDeviceDetails(clientDTO, devices);
        resolve(clientDTO);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
    }
  );
}

var getClientByUsername = (username) => {
  return new Promise(
    (resolve, reject) => {
      UserManagementService.getUserByCredentials({name: username})
      .then(user => { return getClient(user.client); })
      .then(client => { resolve(client); })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
}

var getClientByAuthCredentials = (req) => {
  return new Promise(
    (resolve, reject) => {
      var credentials = BasicAuth(req);
      getClientByUsername(credentials.name)
      .then(client => { resolve(client); })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
}

var _validate = (client) => {
  return new Promise(
    (resolve, reject) => {
      if (!client.role || client.role === undefined) throw(emptyClientRole);
      if (!client.addresses || client.addresses === undefined || client.addresses.length === 0) throw(emptyClientAddresses);
      if (!client.emails || client.emails === undefined || client.emails.length === 0) throw(emptyClientEmails);

      // TODO: Email address validation must be done. Use Validator.isEmail().
      // TODO: contact number validation must be done Use Validator.isMobilePhone().  Locale must be provided sing the npm module os-local.

      RoleManagementService.getRole(client.role)
      .then(role => {
        if (!role || role === undefined) throw(invalidClientRole);
        resolve(client);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
};

var _createPromises = (client) => {
  return new Promise(
    (resolve, reject) => {
      var clientToSave = new Client({
        uuid: client.uuid,
        timestamp: client.timestamp,
        corporateName: client.corporateName,
        firstName: client.firstName,
        lastName: client.lastName,
        middleName: client.middleName,
        primaryEmail: client.primaryEmail,
        type: client.type,
        role: client.role,
      });

      var saveToDbPromises = [];

      // Save addresses in collection "addresses".
      // TODO: if saving client fails, then every save in addresses must be rolled back also.
      client.addresses.forEach(a => {
        var addressToSave = new Address(a);
        addressToSave.client = client.uuid;
        saveToDbPromises.push(addressToSave.save());
      });

      // Save emails in collection "emails".
      // TODO: if saving client fails, then every save in emails must be rolled back also.
      client.emails.forEach(e => {
        var emailToSave = new Email(e);
        emailToSave.client = client.uuid;
        saveToDbPromises.push(emailToSave.save());
      });

      // Save contact numbers in collection "contactNumbers".
      // TODO: if saving client fails, then every save in contactNumbers must be rolled back also.
      client.contactNumbers.forEach(cn => {
        var contactNumberToSave = new ContactNumber(cn);
        contactNumberToSave.client = client.uuid;
        saveToDbPromises.push(contactNumberToSave.save());
      });

      // Finally save client into collection "emails".
      saveToDbPromises.push(clientToSave.save());
      resolve(saveToDbPromises);
  });
};

var addClient = (client) => {
  return new Promise(
    (resolve, reject) => {
      _validate(client)
      .then(validClient => {return _createPromises(validClient);})
      .then(promises => {return Promise.all(promises);})
      .then(results => {resolve(results);})
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
}

var _fillDtoWithClientDetails = (clientDTO, client) => {
  clientDTO.uuid = client.uuid;
  clientDTO.timestamp = client.timestamp;
  clientDTO.corporateName = client.corporateName;
  clientDTO.firstName = client.firstName;
  clientDTO.lastName = client.lastName;
  clientDTO.middleName = client.middleName;
  clientDTO.type = client.type;
  clientDTO.role = client.role;
  clientDTO.primaryEmail = client.primaryEmail;
}

var _fillDtoWithClientAdressDetails = (clientDTO, addresses) => {
  if (addresses.length != 0) addresses: addresses.map(a => {clientDTO.addresses.push(a);});
}

var _fillDtoWithClientEmailDetails = (clientDTO, emails) => {
  if (emails.length != 0) emails: emails.map(e => {clientDTO.emails.push(e);});
}

var _fillDtoWithClientContactNumberDetails = (clientDTO, contactNumbers) => {
  if (contactNumbers.length != 0) contactNumbers: contactNumbers.map(c => {clientDTO.contactNumbers.push(c);});
}

var _fillDtoWithDeviceDetails = (clientDTO, devices) => {
  if (devices.length != 0) devices: devices.map(d => {clientDTO.devices.push(d);});
}

module.exports = {getAllClients, getAllClientsByCorporate, getClient, getClientByUsername, getClientByAuthCredentials, addClient};
