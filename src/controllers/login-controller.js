var BasicAuth = require('basic-auth'),
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
 *         "deviceId":"01234567890123456789",
 *         "client":"1af2e69c-dc0b-479b-ab83-088e54977920","__v":0
 *       },
 *       {
 *         "_id":"5875a2d0c9dcff18d00125fd",
 *         "uuid":"25efe540-a3ba-4156-bfbc-7b252341dca3",
 *         "timestamp":"2017-01-11T03:13:20.883Z",
 *         "name":"device 2",
 *         "status":"online",
 *         "deviceType":"9ebc5c0e-1a29-453f-8acd-d0ec42f0c21d",
 *         "deviceId":"01234567890123456789",
 *         "client":"1af2e69c-dc0b-479b-ab83-088e54977920","__v":0
 *       }
 *     ]
 *   }
 */
exports.login = function (req, res) {
  "use strict";

  // Get the credentials
  var credentials = BasicAuth(req);

  // validate if the user is present and passwords match
  // if match found, send back client details
  // if match not found, send error code 400 or 500 as needed
  UserManagementService.getUserByCredentials(credentials)
  .then(user => {
      console.error('user: ' + JSON.stringify(user));
    return ClientManagementService.getClient(user.client);
  })
  .then( client => {
      console.error('client: ' + JSON.stringify(client));
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
    }
  });
};
