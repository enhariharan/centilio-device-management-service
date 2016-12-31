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
 *           {
 *             "name": "centilio",
 *             "type": "corporate"
 *
 * @apiSuccess (201) {Client} Created client is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "uuid": "1eebec92-87a8-4300-bf88-8a5860875a71",
 *       "timestamp": 1483157605035,
 *       "name": "centilio",
 *       "type": "corporate"
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

  ClientManagementService.addClient(client, function (err) {
    if (err) return res.status('500').send('error encountered while adding client to DB');
    return res.status('201').send(client);
  });
};
