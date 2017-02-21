var utils = require('../models/utilities');
var DeviceParamManagementService = require('../services/device-param-management-service');

/**
 * @api {get} /deviceParams Get all available device params
 * @apiName getAllDeviceParams
 * @apiGroup Device Params
 *
 * @apiParam None
 *
 * @apiSuccess (200) {DeviceParam[]} deviceParams Array of device params.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "deviceParams": [
 *       {
 *         "uuid": "31d6c240-291b-4130-b706-4b2fe6e0f090",
 *         "timestamp": "2017-01-05T09:10:44.629Z",
 *         "name": "latitude",
 *         "deviceType": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d"
 *         "description":"Latitude of the device",
 *         "category": "GPS coordinates"
 *       },
 *       {
 *         "uuid": "7c806c7c-c10d-4302-ac52-664ca0cc3d7e",
 *         "timestam": "2017-01-05T09:11:21.991Z",
 *         "name": "longitude",
 *         "deviceType": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d"
 *         "description":"Longitude of the device",
 *         "category": "GPS coordinates"
 *       },
 *       {
 *         "uuid": "a07a0400-65b4-41be-8ab5-2c13f01e06c3",
 *         "timestamp": "2017-01-05T09:12:57.119Z",
 *         "name": "temperature",
 *         "deviceType": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d"
 *         "description":"Temperature of the device",
 *         "category": "Device basic metrics"
 *       }
 *     ]
 *   }
 */
 exports.getAllDeviceParams = (req, res) => {
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
 * @apiGroup Device Params
 *
 * @apiParam None
 *
 * @apiSuccess (200) {DeviceParam} deviceParam JSON having given uuid.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "deviceParams": [
 *       {
 *         "uuid": "31d6c240-291b-4130-b706-4b2fe6e0f090",
 *         "timestamp": "2017-01-05T09:10:44.629Z",
 *         "name": "latitude",
 *         "deviceType": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d"
 *         "description":"Latitude of the device",
 *         "category": "GPS Coordinates"
 *       }
 *     ]
 *   }
 */
exports.getDeviceParam = (req, res) => {
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
 * @apiGroup Device Params
 *
 * @apiParam (deviceParam) {json} deviceParam Give a device param as JSON.  UUID and timestamp are automatically generated.
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 *   {
 *     "name": Temperature",
 *     "description":"Temperature of the device",
 *     "deviceType": "bd1dbf4f-c708-44d9-8dc1-8498d8f4923d"
 *     "category": "Basic device metrics"
 *   },
 *
 * @apiSuccess (201) {DeviceParam} deviceParam Created device params is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created
 *   {
 *     "uuid": "10a8cf19-49cf-4080-9879-0048602ca4ab",
 *     "timestamp": 1485332172923,
 *     "name": "Temperature",
 *     "description": "Temperature of the device",
 *     "deviceType": "e7a79943-d3bf-44ef-9f20-767b5c00b604",
 *     "category": "Basic device metrics"
 *   }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addDeviceParam = (req, res) => {
  "use strict";
  console.info('req.body: ' + JSON.stringify(req.body));
  if (!req || !req.body) return res.status(400).send('Bad Request');

  var deviceParam = {
    uuid: utils.getUuid(),
    timestamp: utils.getTimestamp(),
    name: req.body.name,
    description: req.body.description,
    deviceType: req.body.deviceType,
    category: req.body.category,
  };

  DeviceParamManagementService.addDeviceParam(deviceParam)
  .then(device => {return res.status('201').send(deviceParam);})
  .catch(err => {
    if (err === 400) console.log('error encountered while adding device param to DB.  Please check your JSON.');
    if (err === 500) console.log('error encountered while adding device param to DB.');
    return res.sendStatus(err);
  });
};
