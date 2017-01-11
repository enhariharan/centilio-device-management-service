var basicAuth = require('basic-auth'),
    UserManagementService = require('../services/user-management-service'),
    ClientManagementService = require('../services/client-management-service');

/**
 * @api {get} /login login into the device manager
 * @apiName login
 * @apiGroup User
 *
 * @apiParam (user) {Credentials} credentials Credentials sent as authentication headera
 *
 * @apiSuccess (200) {Client[]} clients Array of client matching the credentials.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "uuid":"1af2e69c-dc0b-479b-ab83-088e54977920",
 *     "timestamp":"2017-01-11T03:13:20.880Z",
 *     "corporateName":"corporation 1",
 *     "firstName":"Ashok",
 *     "lastName":"Kumar",
 *     "middleName":"M",
 *     "type":"corporate",
 *     "addresses":[
 *       {
 *         "_id":"5875a2d0c9dcff18d0012600",
 *         "client":"1af2e69c-dc0b-479b-ab83-088e54977920",
 *         "line1":"123, HiTec City",
 *         "line2":"",
 *         "city":"Hyderabad",
 *         "state":"Telangana",
 *         "countryCode":"IN",
 *         "zipCode":"500081",
 *         "latitude":"17.447162",
 *         "longitude":"78.376808",
 *         "type":"work",
 *         "status":"active","__v":0
 *       }
 *     ],
 *     "emails":[
 *       {
 *         "_id":"5875a2d0c9dcff18d001260a",
 *         "client":"1af2e69c-dc0b-479b-ab83-088e54977920",
 *         "email":"client1@corp1.com",
 *         "type":"work","__v":0
 *       },
 *       {
 *         "_id":"5875a2d0c9dcff18d001260b",
 *         "client":"1af2e69c-dc0b-479b-ab83-088e54977920",
 *         "email":"client.1@corp1.com",
 *         "type":"work","__v":0
 *       },
 *       {
 *         "_id":"5875a2d0c9dcff18d001260c",
 *         "client":"1af2e69c-dc0b-479b-ab83-088e54977920",
 *         "email":"client.1@gmail.com",
 *         "type":"personal","__v":0
 *       }
 *     ],
 *     "contactNumbers":[
 *       {
 *         "_id":"5875a2d0c9dcff18d0012614",
 *         "client":"1af2e69c-dc0b-479b-ab83-088e54977920",
 *         "number":"+911234567890","type":"work","__v":0
 *       }
 *     ],
 *     "devices":[
 *       {
 *         "_id":"5875a2d0c9dcff18d00125fc",
 *         "uuid":"aeaadfde-e668-4c2c-94e5-249cb8523334",
 *         "timestamp":"2017-01-11T03:13:20.882Z",
 *         "name":"device 1",
 *         "status":"online",
 *         "deviceType":"9ebc5c0e-1a29-453f-8acd-d0ec42f0c21d",
 *         "client":"1af2e69c-dc0b-479b-ab83-088e54977920","__v":0
 *       },
 *       {
 *         "_id":"5875a2d0c9dcff18d00125fd",
 *         "uuid":"25efe540-a3ba-4156-bfbc-7b252341dca3",
 *         "timestamp":"2017-01-11T03:13:20.883Z",
 *         "name":"device 2",
 *         "status":"online",
 *         "deviceType":"9ebc5c0e-1a29-453f-8acd-d0ec42f0c21d",
 *         "client":"1af2e69c-dc0b-479b-ab83-088e54977920","__v":0
 *       }
 *     ]
 *   }
 */
exports.login = function (req, res) {
  "use strict";

  // Get the credentials
  var credentials = basicAuth(req);

  // validate if the user is present and passwords match
  // if match found, send back client details
  // if match not found, send error code 400 or 500 as needed
  UserManagementService.getUser(credentials)
  .then(user => {
    return ClientManagementService.getClient(user.client);
  })
  .then( client => {
    res.status(200).send(client);
  })
  .catch(err => {
    if (err == 500) {
      console.error('500 - error fetching user details');
      res.status(err).send('500 - error fetching user details');
    }
    if (err == 400) {
      console.error('400 - incorrect username or password');
      res.status(err).send('400 - incorrect username or password');
    };
  });
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
