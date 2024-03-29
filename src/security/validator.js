var BasicAuth = require('basic-auth'),
    User = require('../models/user-model').User,
    UserManagementService = require('../services/user-management-service'),
    ClientManagementService = require('../services/client-management-service'),
    RoleManagementService = require('../services/role-management-service');

var isValidCredentials = (req) => {
  return new Promise(
    (resolve, reject) => {
      var credentials = BasicAuth(req);
      if (credentials === undefined || !credentials) reject(403);
      User.findOne({username: credentials.name}).exec()
      .then(u => {
        if (!u || u === undefined
           || credentials.name.toLowerCase().localeCompare(u.username.toLowerCase())
           || credentials.pass.localeCompare(u.password)) reject(403);
        resolve(true);
      })
      .catch(err => {reject(err);});
  });
};

var isUserAdmin = (req) => {
  return new Promise(
    (resolve, reject) => {
      var credentials = BasicAuth(req);
      isValidCredentials(req)
      .then(result => {
        if (!result) reject(403);
        return UserManagementService.getUserByCredentials(credentials);
      })
      .then(user => {
        if (!user || user === undefined || !user.role || user.role === undefined) reject(403);
        return RoleManagementService.getRole(user.role);
      })
      .then(role => {
        if (!role || role === undefined || role.name !== 'admin') reject(403);
        resolve(true);
      })
      .catch(err => { reject(err); });
  });
};

// Authz rules for GET /clients/:uuid/
// Admin user can query any client by uuid
// If not admin, then the uuid must belong to the logged in user's client uuid
var isAuthorizedForGetClientByUuid = (req) => {
  return new Promise(
    (resolve, reject) => {
      var credentials = BasicAuth(req);
      isValidCredentials(req)
      .then(result => {
        if (!result) reject(403);
        console.log('\nisValidCredentials() returned true');
        return ClientManagementService.getClientByAuthCredentials(req);
      })
      .then(client => {
        if (!client || client === undefined) reject(403);
        if (client.uuid === req.params.uuid) resolve(true);
        console.log('\nreq.params.uuid ' + req.params.uuid);
        console.log('\nreturned cient %s, $s' + client.firstName, client.uuid);
        return RoleManagementService.getRoleByUsername(credentials.name);
      })
      .then(role => {
        if (!role || role === undefined || role.name !== 'admin') reject(403);
        console.log('\nreturned role ' + role.name);
        resolve(true);
      })
      .catch(err => {reject(err);});
  });
};

var isValidCredentialsForSuperAdminActivity = (req) => {
  return new Promise(
    (resolve, reject) => {
      var credentials = BasicAuth(req);
      if (credentials.name.toUpperCase() !== 'CENTILIO' || credentials.pass !== '10cA1UY7n23') resolve(false);
      resolve(true);
   })
}

module.exports = {isValidCredentials, isUserAdmin, isAuthorizedForGetClientByUuid, isValidCredentialsForSuperAdminActivity};
