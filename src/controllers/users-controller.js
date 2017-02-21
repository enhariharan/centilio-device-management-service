var BasicAuth = require('basic-auth'),
    Validator = require('../security/validator'),
    UserManagementService = require('../services/user-management-service'),
    ClientManagementService = require('../services/client-management-service'),
    utilities = require('../models/utilities');

/**
 * @api {get} /devices Get all available devices, excluding retired devices, belonging to logged in user.
 * @apiName getAllDevices
 * @apiGroup Device
 *
 * @apiParam {json} Request-header must contain the credentials of logged in user.
 * @apiParam {json} all /devices?all=true will return all devices in the corporate, provided the logged in user
 * has role admin.
 * @apiParam {json} unassignedOnly /devices?unassignedOnly=true will return all devices in the corporate that are
 * not yet assigned to any user, provided the logged in user has role admin. If false, only assigned devices will
 * be returned.  This option must be preceded by the param all=true else it will be ignored.
 * @apiParam {json} showRetiredDevices /devices?showRetiredDevices=true will return all devices including retired
 * devices also. This option is set to false by default.
 *
 * @apiSuccess (200) {Device[]} devices Array of devices.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "devices": [{
 *       "uuid":"0123456789012345678901234567890123456789012345678901234567890123",
 *       "timestamp":"2016-12-30T11:52:28.637Z",
 *       "name":"Device 01",
 *       "latitude":"100.001",
 *       "longitude":"100.001",
 *       "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *       "deviceId":"01234567890123456789",
 *       "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *       "status":"new"
 *     },
 *     {
 *       "uuid":"0123456789012345678901234567890123456789012345678901234567890124",
 *       "timestamp":"2016-12-28T11:52:28.637Z",
 *       "name":"Device 02",
 *       "latitude":"100.001",
 *       "longitude":"100.001",
 *       "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *       "deviceId":"01234567890123456789",
 *       "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *       "status":"new"
 *     }]
 *   }
 */
 exports.getAllUsers = (req, res) => {
  "use strict";

  Validator.isValidCredentialsForSuperAdminActivity(req)
  .then(result => {
    console.log('\nresult 1: ' + JSON.stringify(result));
    if (result) return UserManagementService.getAllUsers();
    else return {};
  })
  .then(users => {
    console.log('\nusers: ' + JSON.stringify(users));
    return res.status(200).send(users);
  })
  .catch(err => {
    console.log('\nerr: %s', JSON.stringify(err) + err.stack);
    return res.sendStatus(err);
  });
};

/**
 * @api {post} /users Add a new user
 * @apiName addUser
 * @apiGroup User
 *
 * @apiParam (user) {Credentials} credentials Credentials of the logged in user
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.
 *                  {json} Request-header Basic Authentication details must ne set. This should be changed to
 *                         stateless JWT based token based authentication.
 *                  {json} Request-body should send the new user name, passsword, role type in the following format.
 * {
 *   "firstName": "John",
 *   "lastName": "Woo",
 *   "email": "john.woo@centil.io",
 *   "password": "password", // TODO: This should be changed to stateless JWT based token based authentication.
 *   "role": "83356361-e0a4-4942-98b8-1a1c8ad4c943"
 * }
 *
 * @apiSuccess (201) {User} user Created user is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (400) {String} BadRequest Error code 400 is returned if the username already exists.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addUser = function (req, res) {
  "use strict";
  var UserAlreadyPresentException = {};

  // Get the credentials
  var credentials = BasicAuth(req);  // TODO: Change this to JWT based stateless token based authentication

  UserManagementService.addUser(credentials, req.body)
  .then(user => {
    console.info('in controller - added new user: ' + JSON.stringify(user));
    return res.sendStatus(201);
  }).catch(err => {
    console.error('in controller - err occured while adding new user: ' + JSON.stringify(err));
    return res.sendStatus(err);
  });
};


/**
 * @api {put} /users Update an existing user
 * @apiName updateUser
 * @apiGroup User
 *
 * @apiParam (user) {Credentials} credentials Credentials sent as authentication headera
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.
 *                  {json} Request-header Basic Authentication details must ne set. This should be changed to stateless JWT based token based authentication.
 *     {
 *       "username": "hanglesias",
 *       "password": "password", // This is done only for the demo. JWT token based authentication should be used instead.
 *       "status": "activated",
 *       "gender": "female",
 *       "profilePicPath": "/profile/pic/path",
 *       "client": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *       "role": "user",
 *     }
 * @apiSuccess (200) {User} user Updated user is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 Created
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (400) {String} BadRequest Error code 400 is returned if the username already exists.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.updateUser = function (req, res) {
  "use strict";

  var receivedUser = {
    username: req.body.username,
    password: req.body.password,
    status: req.body.status,
    gender: req.body.gender,
    profilePicPath: req.body.profilePicPath,
    client: req.body.client,
    role: req.body.role,
  };

  // TODO: Need a mechanism to validate existing user and password.

  // update user.
  UserManagementService.updateUser(receivedUser)
  .then(user => {
    res.status(200).send('User modified.');
    return;
  })
  .catch(err => {
    res.status(500).send('Internal service error while modifying user.');
    return;
  });
};
