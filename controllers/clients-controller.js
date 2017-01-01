var utils = require('../models/utilities.js');
var ClientManagementService = require('../services/client-management-service.js');

/**
 * @api {get} /clients Get all available clients
 * @apiName getAllClients
 * @apiGroup Client
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Client[]} devices Array of clients.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "clients": [
 *        {
 *          "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *          "timestamp": "2016-12-30T12:32:20.819Z",
 *          "name": "Ashok Kumar",
 *          "type": "retail"
 *          "addresses" :
 *            [
 *              {
 *                "line1" : "123, ABC Road",
 *                "line2" : "DEF Blvd",
 *                "city" : "GHIJK City",
 *                "state" : "LM State",
 *                "countryCode" : "IN",
 *                "zipCode" : "NOPQRS",
 *                "latitude" : "100.01",
 *                "longitude" : "100.01",
 *                "type" : "work",
 *                "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *                "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *                "status" : "active",
 *                "_id" : ObjectId("5867518afc5bcb32f456f9c5") *              },
 *              },
 *              {
 *                "line1" : "Address line 1",
 *                "line2" : "Address line 2",
 *                "city" : "City name",
 *                "state" : "State Code",
 *                "countryCode" : "country Code",
 *                "zipCode" : "ZiPCoDe",
 *                "latitude" : "100.01",
 *                "longitude" : "100.01",
 *                "type" : "home",
 *                "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *                "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *                "status" : "active",
 *                "_id" : ObjectId("5867518afc5bcb32f456f9c5")
 *              },
 *            ]
 *        },
 *        {
 *          "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098612",
 *          "timestamp": "2016-12-28T12:32:20.819Z",
 *          "name": "Centilio",
 *          "type": "corporate"
 *        },
 *      ]
 *    }
 */
exports.getAllClients = function (req, res) {
  "use strict";

  ClientManagementService.getAllClients(function (err, context) {
    if (err) return res.status('500').send('error encountered while reading clients from DB');

    if (!context) return res.status('200').send('No clients found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {post} /clients Add a new client
 * @apiName addClient
 * @apiGroup Client
 *
 * @apiParam (client) {Client} Give a client as JSON
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 * {
 *   "name": "AB Inc",
 *   "type": "corporate",
 *   "addresses" : [
 *     {
 *       "line1" : "123, ABC Road",
 *       "line2": "DEF Blvd",
 *       "city": "GHIJK City",
 *       "state": "LM State",
 *       "countryCode": "IN",
 *       "zipCode": "NOPQRS",
 *       "latitude": "100.01",
 *       "longitude": "100.01",
 *       "type": "work"
 *     }
 *   ]
 * }
 *
 * @apiSuccess (201) {Client} Created client is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *     "uuid": "88b28115-b859-452c-9fb4-5323c9ed69e6",
 *     "timestamp": 1483166090614,
 *     "name": "AB Inc",
 *     "type": "corporate",
 *     "addresses":
 *       [
 *         {
 *           "line1": "123, ABC Road",
 *           "line2": "DEF Blvd",
 *           "city": "GHIJK City",
 *           "state": "LM State",
 *           "countryCode": "IN",
 *           "zipCode": "NOPQRS",
 *           "latitude": "100.01",
 *           "longitude": "100.01",
 *           "type": "work",
 *           "uuid": "9eab071b-529a-4175-8033-7043a8fcc510",
 *           "timestamp": 1483166090615,
 *           "status": "active"
 *         }
 *       ]
 *     }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of osme error in the server.
 */
exports.addClient = function (req, res) {
  if (!req || !req.body) {
    console.error('invalid request object');
    return res.status(400).send('Bad Request');
  }

  var client = {
    uuid: utils.getUuid(),
    timestamp: utils.getTimestamp(),
    name: req.body.name,
    type: req.body.type,
  };

  client.addresses = [];
  req.body.addresses.forEach(function(address) {
    client.addresses.push(address);
  });

  ClientManagementService.addClient(client, function (err) {
    if (err) return res.status('500').send('error encountered while adding client to DB');
    return res.status('201').send(client);
  });
};
