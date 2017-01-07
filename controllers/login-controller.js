var basicAuth = require('basic-auth'),
    UserManagementService = require('../services/user-management-service');

/**
 * @api {get} /login login into the device manager
 * @apiName login
 * @apiGroup User
 *
 * @apiParam (user) {Credentials} credentials Credentials sent as authentication headera
 *
 * @apiSuccess (200) {Client[]} clients Array of client matching the credentials.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "clients": [
 *       {
 *         "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *         "timestamp": "2016-12-30T12:32:20.819Z",
 *         "name": "Ashok Kumar",
 *         "type": "retail"
 *         "addresses" :
 *           [
 *             {
 *               "line1" : "123, ABC Road",
 *               "line2" : "DEF Blvd",
 *               "city" : "GHIJK City",
 *               "state" : "LM State",
 *               "countryCode" : "IN",
 *               "zipCode" : "NOPQRS",
 *               "latitude" : "100.01",
 *               "longitude" : "100.01",
 *               "type" : "work",
 *               "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *               "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *               "status" : "active",
 *               "_id" : ObjectId("5867518afc5bcb32f456f9c5")
 *             },
 *             {
 *               "line1" : "Address line 1",
 *               "line2" : "Address line 2",
 *               "city" : "City name",
 *               "state" : "State Code",
 *               "countryCode" : "country Code",
 *               "zipCode" : "ZiPCoDe",
 *               "latitude" : "100.01",
 *               "longitude" : "100.01",
 *               "type" : "home",
 *               "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *               "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *               "status" : "active",
 *               "_id" : ObjectId("5867518afc5bcb32f456f9c5")
 *             },
 *           ]
 *         },
 *         {
 *           "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098612",
 *           "timestamp": "2016-12-28T12:32:20.819Z",
 *           "name": "Centilio",
 *           "type": "corporate"
 *         },
 *       ]
 *     }
 */
exports.login = function (req, res) {
  "use strict";

  // Get the credentials
  var credentials = basicAuth(req);
  console.info('credentials: ' + JSON.stringify(credentials));

  // validate if the user is present and passwords match
  // if match found, send back client details
  // if match not found, send back a dummy 'OK' message since...
  // ... since we do not want the user to know he sent incorrect username/password
  // lest he/she go fishing with different username password combos.
  UserManagementService.getUser(credentials)
  .then(user => {
    console.info('user: ' + JSON.stringify(user));
    ClientManagementService.getClientByUser(user);
  })
  .then( client => {
    res.status(200).send(client);
  })
  .catch(err => {res.status(200).send('OK');});
};

/**
 * @api {post} /login Add a new user
 * @apiName addUser
 * @apiGroup User
 *
 * @apiParam (user) {Credentials} credentials Credentials sent as authentication headera
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.
 *                  {json} Request-header Basic Authentication details must ne set. This should be changed to stateless JWT based token based authentication.
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
  var credentials = basicAuth(req);  // TODO: Change this to JWT based stateless token based authentication

  UserManagementService.addUser(credentials)
  .then(user => {
    console.info('in controller - added new user: ' + JSON.stringify(user));
    return res.sendStatus(201);
  }).catch(err => {
    console.error('in controller - err occured while adding new user: ' + JSON.stringify(err));
    return res.sendStatus(err);
  });
};


/**
 * @api {put} /login Add a new user
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
