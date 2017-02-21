var Setup = require('../../public/qa/setup-db.js');
var utils = require('../models/utilities.js');
var ClientManagementService = require('../services/client-management-service.js');
var RoleManagementService = require('../services/role-management-service.js');

exports.initializeDB = () => {
  return new Promise(
    (resolve, reject) => {
      Setup.setupDB()
      .then(result => {
        if (result !== false) resolve(result);
      })
      .catch(err => { reject(err); });
  })
}

var _prepareToSave = (instanceDTO) => {
  return new Promise(
    (resolve, reject) => {
      RoleManagementService.getRoleByName('admin')
      .then(adminRole => {
        console.log('_prepareToSave.adminRole: ' + JSON.stringify(adminRole.name));
        if (!instanceDTO || instanceDTO === undefined) reject(400);
        if (!instanceDTO.firstname || instanceDTO.firstname === undefined) reject(400);
        if (!instanceDTO.lastname || instanceDTO.lastname === undefined) reject(400);
        if (!instanceDTO.email || instanceDTO.email === undefined) reject(400);
        if (!instanceDTO.organisation || instanceDTO.organisation === undefined) reject(400);

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
      .catch(err => { reject(err); })
  });
};

exports.initializeInstance = (instanceDTO) => {
  return new Promise(
    (resolve, reject) => {
      _prepareToSave(instanceDTO)
      .then(clientDTO => { return ClientManagementService.addClient(clientDTO); })
      .then(savedClient => {
        if (!savedClient || savedClient === undefined) throw(500);
        resolve(savedClient);
      })
      .catch(err => { reject(err); });
  })
}
