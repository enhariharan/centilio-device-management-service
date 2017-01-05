var utils = require('../models/utilities.js');
var DeviceParamManagementService = require('../services/device-param-management-service.js');

/**
 * @api {get} /deviceParams Get all available devices
 * @apiName getAllDeviceParams
 * @apiGroup DeviceParam
 *
 * @apiParam None
 *
 * @apiSuccess (200) {DeviceParam[]} devices Array of device params.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "deviceParams": [
 *         {
 *           "uuid": "31d6c240-291b-4130-b706-4b2fe6e0f090",
 *           "timestamp": "2017-01-05T09:10:44.629Z",
 *           "name": "latitude",
 *           "deviceType": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d"
 *         },
 *         {
 *           "uuid": "7c806c7c-c10d-4302-ac52-664ca0cc3d7e",
 *           "timestamp": "2017-01-05T09:11:21.991Z",
 *           "name": "longitude",
 *           "deviceType": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d"
 *         },
 *         {
 *           "uuid": "a07a0400-65b4-41be-8ab5-2c13f01e06c3",
 *           "timestamp": "2017-01-05T09:12:57.119Z",
 *           "name": "temperature",
 *           "deviceType": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d"
 *         }
 *       ]
 *     }
 */
 exports.getAllDeviceParams = function (req, res) {
  "use strict";

  DeviceParamManagementService.getAllDeviceParams(function (err, context) {
    if (err) return res.status('500').send('error encountered while reading device params from DB');

    if (!context) return res.status('200').send('No device params found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {get} /deviceParams/:uuid Get device param by given uuid
 * @apiName getDeviceParam
 * @apiGroup DeviceParam
 *
 * @apiParam None
 *
 * @apiSuccess (200) {DeviceParam} Dvice param JSON having given uuid.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "deviceParams": [
 *         {
 *           "uuid": "31d6c240-291b-4130-b706-4b2fe6e0f090",
 *           "timestamp": "2017-01-05T09:10:44.629Z",
 *           "name": "latitude",
 *           "deviceType": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d"
 *         }
 *       ]
 *     }
 */
exports.getDeviceParam = function (req, res) {
  "use strict";
  var uuid = req.params.uuid;
  DeviceParamManagementService.getDeviceParam(uuid, function (err, context) {
    if (err) return res.status('500').send('error encountered while reading device param from DB');

    if (!context) return res.status('400').send('No such device param found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {post} /deviceParams Add a new device param
 * @apiName addDeviceParam
 * @apiGroup DeviceParam
 *
 * @apiParam (deviceParam) {json} Give a device param as JSON.  UUID and timestamp are automatically generated.
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 *           {
 *             "name": Temperature",
 *             "description":"Temperature of the device",
 *             "deviceType": {
 *               "uuid": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d"
 *             }
 *           },
 *
 * @apiSuccess (201) {DeviceParam} Created device params is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "uuid": "22e0805a-7002-4ae7-be1e-4877dd59fc04",
 *       "timestamp": 1483155714863,
 *       "name": "temperature",
 *       "description": "Temperature of the device",
 *       "deviceType": {
 *         "uuid": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d"
 *       }
 *     }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addDeviceParam = function (req, res) {
  console.info('req.body: ' + JSON.stringify(req.body));
  if (!req || !req.body) {
    console.error('invalid request object');
    return res.status(400).send('Bad Request');
  }

  var deviceParam = {
    uuid: utils.getUuid(),
    timestamp: utils.getTimestamp(),
    name: req.body.name,
    description: req.body.description,
    deviceType: req.body.deviceType
  };
  console.info('deviceParam: ' + JSON.stringify(deviceParam));

  DeviceParamManagementService.addDeviceParam(deviceParam, function (err) {
    if (err === 400) return res.status('400').send('error encountered while adding device param to DB.  Please check your JSON.');
    if (err)  return res.status('500').send('error encountered while adding device param to DB.');

    return res.status('201').send(deviceParam);
  });
};
