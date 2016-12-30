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
 * @apiParam (device) {Device} Give a device as JSON
 *
 * @apiSuccess (201) {Device} Created devices is returned as JSON.
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
