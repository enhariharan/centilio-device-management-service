var utils = require('../models/utilities');
var DeviceTypeManagementService = require('../services/device-type-management-service');

/**
 * @api {get} /deviceTypes Get all available device types
 * @apiName getAllDeviceTypes
 * @apiGroup Device Type
 *
 * @apiParam None
 *
 * @apiSuccess (200) {DeviceType[]} deviceTypes Array of device types.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "deviceTypes": [
 *         {
 *           "uuid": "54d278f8-4068-45c5-950d-cd8c83d37b44",
 *           "timestamp": "2017-01-05T06:21:41.808Z",
 *           "name": "smart light",
 *           "status": "active"
 *         },
 *         {
 *           "uuid": "38ff54e1-ec5f-4c4a-861e-95252560289c",
 *           "timestamp": "2017-01-05T06:36:51.736Z",
 *           "name": "mobile",
 *           "status": "active"
 *         }
 *       ]
 *     }
 */
 exports.getAllDeviceTypes = function (req, res) {
  "use strict";

  DeviceTypeManagementService.getAllDeviceTypes(function (err, context) {
    if (err) return res.status('500').send('error encountered while reading device types from DB');

    if (!context) return res.status('200').send('No device types found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {get} /devicetypes/:uuid Get device type by given uuid
 * @apiName getDeviceType
 * @apiGroup Device Type
 *
 * @apiParam None
 *
 * @apiSuccess (200) {DeviceType} deviceType JSON of device type having given uuid.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "deviceTypes": [
 *         {
 *           "uuid": "38ff54e1-ec5f-4c4a-861e-95252560289c",
 *           "timestamp": "2017-01-05T06:36:51.736Z",
 *           "name": "mobile",
 *           "status": "active"
 *         }
 *       ]
 *     }
 */
exports.getDeviceType = function (req, res) {
  "use strict";
  var uuid = req.params.uuid;
  DeviceTypeManagementService.getDeviceType(uuid, function (err, context) {
    if (err) return res.status('500').send('error encountered while reading device type from DB');

    if (!context) return res.status('400').send('No such device type found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {post} /devicetypes Add a new device type
 * @apiName addDeviceType
 * @apiGroup Device Type
 *
 * @apiParam (deviceType) {json} deviceType Give a device type as JSON.  UUID and timestamp are automatically generated.
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 *     {
 *       "name": "mobile",
 *       "status": "active"
 *     }
 *
 * @apiSuccess (201) {DeviceType} deviceType Created device types is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "uuid": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d",
 *       "timestamp": 1483598767702,
 *       "name": "mobile",
 *       "status": "active"
 *     }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addDeviceType = function (req, res) {
  console.log('req.body: ' + JSON.stringify(req.body));

  if (!req || !req.body) {
    console.error('invalid request object');
    return res.status(400).send('Bad Request');
  }

  var deviceType = {
    uuid: utils.getUuid(),
    timestamp: utils.getTimestamp(),
    name: req.body.name,
    status: req.body.status,  // TODO: Need to add logic (PUT REST API) to change this to 'retired' when needed.
  };

  DeviceTypeManagementService.addDeviceType(deviceType, function (err) {
    if (err) return res.status('500').send('error encountered while adding device type to DB ' + err.stack);
    return res.status('201').send(deviceType);
  });
};
