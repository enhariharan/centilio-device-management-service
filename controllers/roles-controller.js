var utils = require('../src/models/utilities.js');
var RoleManagementService = require('../src/services/role-management-service');

/**
 * @api {get} /roles Get all available roles
 * @apiName getAllRoles
 * @apiGroup Role
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Role[]} Roles Array of roles.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "roles": [
 *        {
 *          "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *          "timestamp": "2016-12-30T12:32:20.819Z",
 *          "name": "admininstrator",
 *          "status": "active"
 *    }
 */
exports.getAllRoles = function (req, res) {
  "use strict";

  RoleManagementService.getAllRoles(function (err, context) {
    if (err) return res.status('500').send('error encountered while reading roles from DB');

    if (!context) return res.status('200').send('No roles found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {post} /roles Add a new role
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
 *     HTTP/1.1 201 Created
 *     {
 *     "uuid": "88b28115-b859-452c-9fb4-5323c9ed69e6",
 *     "timestamp": 1483166090614,
 *     "name": "AB Inc",
 *     "status": "active"
 *     }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addRole = function (req, res) {
  if (!req || !req.body) {
    console.error('invalid request object');
    return res.status(400).send('Bad Request');
  }

  var role = {
    uuid: utils.getUuid(),
    timestamp: utils.getTimestamp(),
    name: req.body.name,
    status: 'active',
  };

  RoleManagementService.addRole(role, function (err) {
    if (err) {
      console.error('error occured: ' + err.stack);
      return res.status('500').send('error encountered while adding role to DB');
    }
    return res.status('201').send(role);
  });
};
