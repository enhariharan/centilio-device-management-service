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
      Role.find({'uuid': roleUuid}).exec().then((roles) => {
        console.info('roles: ' + JSON.stringify(roles));
        if (roles === undefined || !roles) reject(err || 400);
        resolve(roles[0]);
      })
  });
}

exports.addRole = (role, callback) => {
  var roleToSave = new Role(role);
  console.log('roleToSave: ' + JSON.stringify(roleToSave));
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
