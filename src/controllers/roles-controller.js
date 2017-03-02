var utils = require('../models/utilities');
var RoleManagementService = require('../services/role-management-service');
var Validator = require('../security/validator');
var Errors = require('../security/errors').errors;

/**
 * @api {get} /roles Get all available roles
 * @apiName getAllRoles
 * @apiGroup Role
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Role[]} Roles Array of roles.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "roles": [{
 *     "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *     "timestamp": "2016-12-30T12:32:20.819Z",
 *     "name": "admininstrator",
 *     "status": "active"
 *   }]
 * }
 */
exports.getAllRoles = (req, res) => {
  "use strict";

  RoleManagementService.getAllRoles()
  .then(roles => { return res.status('200').send(roles); })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};

/**
 * @api {post} /roles Add a new role. Only admin user can adda  new role.
 * @apiName addRole
 * @apiGroup Role
 *
 * @apiParam (role) {Role} Role Give a role as JSON
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 * {
 *   "name": "adminstrator"
 * }
 *
 * @apiSuccess (201) {Role} Role Created role is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "uuid": "88b28115-b859-452c-9fb4-5323c9ed69e6",
 *   "timestamp": 1483166090614,
 *   "name": "AB Inc",
 *   "status": "active"
 * }
 *
 * @apiError (400) {String} BadRequest The JSON format is incorrect.
 * @apiError (403) {String} AuthenticationError Logged in user does not have admin priviliges.
 * @apiError (500) {String} InternalServerError some other unknown error in the server.
 */
exports.addRole = (req, res) => {
  Validator.isUserAdmin(req)
  .then(result => {
    return RoleManagementService.getRoleByName(req.body.name);
  })
  .then(foundRole => {
    if (foundRole && foundRole !== undefined) throw(Errors.rolewithGivenNameAlreadyExists);

    var role = {
      uuid: utils.getUuid(),
      timestamp: utils.getTimestamp(),
      name: req.body.name,
      status: 'active',
    };
    return RoleManagementService.addRole(role);
  })
  .then(savedRole => { return res.status('201').send(savedRole); })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
