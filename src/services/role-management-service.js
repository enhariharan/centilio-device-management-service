var Role = require('../models/role-model').Role,
    User = require('../models/user-model').User;

exports.getAllRoles = (callback) => {
  Role.find(function (err, roles) {
    if (err) {
      console.error('error while reading roles from DB = ' + err);
      return callback(err, null);
    }

    if (!roles.length) {
      console.info('No roles found in DB...');
      return callback(0, null);
    }

    var context = {
      roles: roles.map(function(role) {
        var rol = {
          uuid: role.uuid,
          timestamp: role.timestamp,
          name: role.name,
          status: role.status,
        };
        return rol;
      }),
    };
    return callback(0, context);
  });
}

exports.getRole = (roleUuid) => {
  return new Promise(
    (resolve, reject) => {
      Role.findOne({'uuid': roleUuid}).exec()
      .then((role) => {
        if (role === undefined || !role) reject(err || 400);
        resolve(role);
      })
      .catch(err => {
        console.log('RoleManagementService.getRole() returning err ' + err);
        reject(err);
      });
  });
}

exports.getRoleByUsername = (username) => {
  return new Promise(
    (resolve, reject) => {
      User.findOne({'username': username}).exec()
      .then(user => {return Role.findOne({'uuid': user.role}).exec();})
      .then(role => {
        if (role === undefined || !role) reject(err || 400);
        resolve(role);
      })
      .catch(err => {reject(err);})
  });
}

exports.getRoleByClient = (clientUuid) => {
  return new Promise(
    (resolve, reject) => {
      Client.findOne({'uuid': clientUuid}).exec()
      .then(client => {
        if (client === undefined || !client) reject(err || 400);
        return Role.findOne({'uuid': client.role}).exec();
      })
      .then(role => {
        if (role === undefined || !role) reject(err || 400);
        resolve(role);
      })
      .catch(err => {reject(err);})
  });
}

exports.addRole = (role, callback) => {
  var roleToSave = new Role(role);
  roleToSave.save(function(err) {
    if (err) {
      console.error('Error while saving role to database.');
    }
    return callback(err);
  });
}

// TODO: Uncomment this method and fix to make this synchronous.
// exports.CheckIfRolePresentByName = function(roleName) {
//   console.info('rolename: ' + JSON.stringify(roleName));
//   Role.count({name: roleName}, function(err, count) {
//     if (err) {
//       console.error('Error while querying for role %s from database.', roleName);
//     }
//     return count != 0;
//   });
// }
