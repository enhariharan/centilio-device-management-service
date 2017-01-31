var BasicAuth = require('basic-auth'),
    UserManagementService = require('../src/services/user-management-service'),
    ClientManagementService = require('../src/services/client-management-service'),
    utilities = require('../src/models/utilities');

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
