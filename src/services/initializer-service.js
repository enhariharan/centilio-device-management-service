var Setup = require('../../public/qa/setup-db');
var utils = require('../models/utilities');
var ClientManagementService = require('../services/client-management-service');
var RoleManagementService = require('../services/role-management-service');
var Errors = require('../security/errors').errors;

exports.initializeDB = () => {
  return new Promise(
    (resolve, reject) => {
      Setup.setupDB()
      .then(result => {
        if (result !== false) resolve(result);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  })
}

var _prepareToSave = (instanceDTO) => {
  return new Promise(
    (resolve, reject) => {
      RoleManagementService.getRoleByName('admin')
      .then(adminRole => {
        if (!instanceDTO.firstname || instanceDTO.firstname === undefined) throw(Errors.emptyFirstNameInInstance);
        if (!instanceDTO.lastname || instanceDTO.lastname === undefined) throw(Errors.emptyLastNameInInstance);
        if (!instanceDTO.email || instanceDTO.email === undefined) throw(Errors.emptyEmailInInstance);
        if (!instanceDTO.organisation || instanceDTO.organisation === undefined) throw(Errors.emptyOrganizationInInstance);

        // copy everything from request body into a DTO object
        var clientDTO = {
          uuid: utils.getUuid(),
          timestamp: utils.getTimestamp(),
          corporateName: instanceDTO.organisation,
          firstName: instanceDTO.firstname,
          lastName: instanceDTO.lastname,
          middleName: '',
          primaryEmail: instanceDTO.email,
          type: 'active',
          role: adminRole.uuid,
          addresses: [],
          emails: [],
          contactNumbers: [],
        };

        if (instanceDTO.address && instanceDTO.address !== undefined) clientDTO.addresses.push({
          line1: instanceDTO.address.line1,
          line2: instanceDTO.address.line2,
          city: instanceDTO.address.city,
          state: instanceDTO.address.state,
          zipCode: instanceDTO.address.pin,
          countryCode: instanceDTO.address.countryCode,
          type: "work"
        });
        if (instanceDTO.email && instanceDTO.email !== undefined) clientDTO.emails.push({
          email: instanceDTO.email,
          type: "primary"
        });

        resolve(clientDTO);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
};

exports.initializeInstance = (instanceDTO) => {
  return new Promise(
    (resolve, reject) => {
      _prepareToSave(instanceDTO)
      .then(clientDTO => { return ClientManagementService.addClient(clientDTO); })
      .then(savedClient => {
        if (!savedClient || savedClient === undefined) throw(Errors.couldNotCreateClientToInitializeInstance);
        console.info('savedClient:' + JSON.stringify(savedClient));
        resolve(savedClient);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  })
}
