var utils = require('../models/utilities.js');
var DeviceManagementService = require('../services/device-management-service.js');

/**
 * @api {get} /devices Get all available devices
 * @apiName getAllDevices
 * @apiGroup Device
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Device[]} devices Array of devices.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "devices":
 *         [
 *           {
 *             "uuid":"0123456789012345678901234567890123456789012345678901234567890123",
 *             "timestamp":"2016-12-30T11:52:28.637Z",
 *             "name":"Device 01",
 *             "latitude":"100.001",
 *             "longitude":"100.001",
 *             "status":"new"
 *           },
 *           {
 *             "uuid":"0123456789012345678901234567890123456789012345678901234567890124",
 *             "timestamp":"2016-12-28T11:52:28.637Z",
 *             "name":"Device 02",
 *             "latitude":"100.001",
 *             "longitude":"100.001",
 *             "status":"new"
 *           },
 *         ]
 *     }
 */
 exports.getAllDevices = function (req, res) {
  "use strict";

  DeviceManagementService.getAllDevices(function (err, context) {
    if (err) return res.status('500').send('error encountered while reading devices from DB');

    if (!context) return res.status('200').send('No devices found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {post} /devices Add a new device
 * @apiName addDevice
 * @apiGroup Device
 *
 * @apiParam (device) {json} Give a device as JSON.  UUID and timestamp are automatically generated.
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 *           {
 *             "name":"Device 01",
 *             "latitude":"100.001",
 *             "longitude":"100.001",
 *             "status":"new"
 *           },
 *
 * @apiSuccess (201) {Device} Created devices is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "uuid": "22e0805a-7002-4ae7-be1e-4877dd59fc04",
 *       "timestamp": 1483155714863,
 *       "name": "device 100",
 *       "latitude": "103.001",
 *       "longitude": "103.001",
 *       "status": "new"
 *     }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of osme error in the server.
 */
exports.addDevice = function (req, res) {
  if (!req || !req.body) {
    console.error('invalid request object');
    return res.status(400).send('Bad Request');
  }

  var device = {
    uuid: utils.getUuid(),
    timestamp: utils.getTimestamp(),
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    status: req.body.status
  };

  DeviceManagementService.addDevice(device, function (err) {
    if (err) return res.status('500').send('error encountered while adding device to DB');
    return res.status('201').send(device);
  });
};
