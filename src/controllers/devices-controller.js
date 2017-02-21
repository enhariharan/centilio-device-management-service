var utils = require('../models/utilities'),
    BasicAuth = require('basic-auth'),
    User = require('../models/user-model').User,
    Device = require('../models/device-model').Device,
    ClientManagementService = require('../services/client-management-service'),
    DeviceManagementService = require('../services/device-management-service'),
    UserManagementService = require('../services/user-management-service'),
    Validator = require('../security/validator'),
    DeviceParamsManagementService = require('../services/device-param-management-service'),
    DeviceReadingManagementService = require('../services/device-reading-management-service');

/**
 * @api {get} /devices Get all available devices, excluding retired devices, belonging to logged in user.
 * @apiName getAllDevices
 * @apiGroup Device
 *
 * @apiParam {json} Request-header must contain the credentials of logged in user.
 * @apiParam {json} all /devices?all=true will return all devices in the corporate, provided the logged in user
 * has role admin.
 * @apiParam {json} unassignedOnly /devices?unassignedOnly=true will return all devices in the corporate that are
 * not yet assigned to any user, provided the logged in user has role admin. If false, only assigned devices will
 * be returned.  This option must be preceded by the param all=true else it will be ignored.
 * @apiParam {json} showRetiredDevices /devices?showRetiredDevices=true will return all devices including retired
 * devices also. This option is set to false by default.
 *
 * @apiSuccess (200) {Device[]} devices Array of devices.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "devices": [{
 *       "uuid":"0123456789012345678901234567890123456789012345678901234567890123",
 *       "timestamp":"2016-12-30T11:52:28.637Z",
 *       "name":"Device 01",
 *       "latitude":"100.001",
 *       "longitude":"100.001",
 *       "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *       "deviceId":"01234567890123456789",
 *       "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *       "status":"new"
 *     },
 *     {
 *       "uuid":"0123456789012345678901234567890123456789012345678901234567890124",
 *       "timestamp":"2016-12-28T11:52:28.637Z",
 *       "name":"Device 02",
 *       "latitude":"100.001",
 *       "longitude":"100.001",
 *       "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *       "deviceId":"01234567890123456789",
 *       "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *       "status":"new"
 *     }]
 *   }
 */
 exports.getAllDevices = (req, res) => {
  "use strict";

  Validator.isValidCredentials(req)
  .then(result => {
    if (!result || result === undefined) throw (403);
    var credentials = BasicAuth(req);
    return UserManagementService.getUserByCredentials(credentials);
  })
  .then(user => { return DeviceManagementService.getDevicesByClient(user.client, req.query); })
  .then(devices => { return res.status(200).send(devices); })
  .catch(err => { return res.sendStatus(err); });
};

/**
 * @api {get} /devices/:id Get device by given uuid or deviceId
 * @apiName getDevice
 * @apiGroup Device
 *
 * @apiParam {json} Request-header must contain the credentials of logged in user
 *
 * @apiSuccess (200) {Device} Device JSON having given uuid or deviceId.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "devices":
 *   [
 *     {
 *       "uuid":"0123456789012345678901234567890123456789012345678901234567890123",
 *       "timestamp":"2016-12-30T11:52:28.637Z",
 *       "name":"Device 01",
 *       "latitude":"100.001",
 *       "longitude":"100.001",
 *       "status":"new"
 *       "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *       "deviceId": "01234567890123456789",
 *       "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *     }
 *   ]
 * }
 */
exports.getDevice = (req, res) => {
  "use strict";

  var uuid = req.params.uuid;
  Validator.isValidCredentials(req)
  .then(result => {
    if (!result || result === undefined) throw (403);
    var credentials = BasicAuth(req);
    return ClientManagementService.getClientByUsername(credentials.name);
  })
  .then(client => {
    if (!client || client === undefined) throw (403);
    return DeviceManagementService.getDeviceByUuidAndClientUuid(uuid, client.uuid);
  })
  .then(device => {
    if (!device || device === undefined) throw(400);
    return res.status('200').send(device);
  })
  .catch(err => {
    console.info('error: ' + err.stack);
    return res.sendStatus(err);
  })
};

/**
 * @api {get} /devices/:uuid/deviceReadings Get device readings by given device uuid
 * @apiName getDeviceReadingsByDeviceUuid
 * @apiGroup Device
 *
 * @apiParam latestOnly - If this param is set to true (/devices/:uuid/deviceReadings?latestOnly=true) then only
 * the latest reading recorded for this device is returned.  Else all readings of this device are returned.
 * @apiParam from - If this param is set (/devicereadings/:uuid/deviceReadings?from=timestamp) then all
 * readings, for this device, from the given timestamp till the present moment are returned.
 * @apiParam to - If this param is set (/devicereadings/:uuid/deviceReadings?to=timestamp) then all
 * readings, for this device, from the beginning to the given timestamp are returned.
 *
 * @apiSuccess (200) {Device} Device readings array as JSON.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "deviceReadings":
 *     [
 *       {
 *         "uuid": "f982cea9-d271-445d-a937-6a5dafef6d29",
 *         "timestamp": "2017-01-18T07:14:34.472Z",
 *         "device": "20e7edea-0db9-4595-844f-c42b1b6e3951",
 *         "readings":
 *         [
 *           {
 *             "type": "latitude",
 *             "value": "100.01",
 *             "_id": "587f15da8636f73e30eff809"
 *           },
 *           {
 *             "type": "longitude",
 *             "value": "100.001",
 *             "_id": "587f15da8636f73e30eff808"
 *           },
 *           {
 *             "type": "charging status",
 *             "value": "charging",
 *             "_id": "587f15da8636f73e30eff807"
 *           },
 *           {
 *             "type": "current charge",
 *             "value": "80",
 *             "_id": "587f15da8636f73e30eff806"
 *           }
 *         ]
 *       },
 *       ...
 *       ...
 *     ]
 * }
 */
exports.getDeviceReadingsByDeviceUuid = (req, res) => {
  "use strict";

  var credentials = BasicAuth(req); // TODO: Change this to JWT based stateless token based authentication
  if (credentials === undefined || !credentials) return res.sendStatus(403);
  var uuid = req.params.uuid;

  User.find({username: credentials.name}).exec()
  .then(user => {
    if (!user || user === undefined || credentials.name.toLowerCase().localeCompare(user[0].username.toLowerCase()) || credentials.pass.localeCompare(user[0].password)) return res.sendStatus(403);
    return DeviceManagementService.getDeviceByUuidAndClientUuid(uuid, user[0].client);
  })
  .then(device => {
    if (!device || device === undefined || device.length === 0) return res.status('400').send('No such device found in DB...');
    return DeviceReadingManagementService.getDeviceReadingsByDeviceUuid(uuid, req.query.latestOnly === 'true', req.query.from, req.query.to);
  })
  .then(deviceReadings => {
    console.log('\ndeviceReadings: ' + JSON.stringify(deviceReadings));
    if (!deviceReadings || deviceReadings.length === 0) return res.status('200').send('No device readings found for this device...');
    return res.status('200').send(deviceReadings);
  });
};

/**
 * @api {get} /devices/:uuid/deviceParams Get device parameters provided for given device uuid
 * @apiName getDeviceParamsByDeviceUuid
 * @apiGroup Device
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Device} Device params array as JSON.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "_id": "58ab307f41cfa343c672f3b4",
 *     "uuid": "7e21a21f-bfb7-4218-9d3a-7ec61254688d",
 *     "timestamp": "2017-02-20T18:07:59.242Z",
 *     "name": "latitude",
 *     "description": "latitude of the device position",
 *     "category": "Location coordinates",
 *     "deviceType": "all",
 *     "__v": 0
 *   },
 *   ...
 *   ...
 * ]
 */
exports.getDeviceParamsByDeviceUuid = (req, res) => {
  "use strict";

  console.log('\ngetDeviceParamsByDeviceUuid()');
  var uuid = req.params.uuid;

  DeviceManagementService.getDevice(uuid)
  .then(device => {
    if (!device || device === undefined) return res.status('400').send('Error: No such device found in DB...');
    return DeviceParamsManagementService.getDeviceParamsByDeviceUuid(uuid);
  })
  .then(deviceParams => {
    if (!deviceParams || deviceParams.length === 0) return res.status('200').send('No device params found for this device...');
    return res.status('200').send(deviceParams);
  })
  .catch(err => {
    console.error('Err: %s - %s', err, err.stack);
    return res.status(err).send(err.stack);
  });
};

/**
 * @api {post} /devices Add a new device. Only admin or logged in user can add new device.
 * @apiName addDevice
 * @apiGroup Device
 *
 * @apiParam (device) {json} Give a device as JSON.  UUID and timestamp are automatically generated.
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 *   {
 *     "name":"Device 01",
 *     "latitude":"100.001",
 *     "longitude":"100.001",
 *     "status":"new",
 *     "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *     "deviceId": "01234567890123456789",
 *     "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *   },
 * If the client entry above is not provided then the device will be considered unassigned to any client.
 *
 * @apiSuccess (201) {Device} Created devices is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "uuid": "22e0805a-7002-4ae7-be1e-4877dd59fc04",
 *   "timestamp": 1483155714863,
 *   "name": "device 100",
 *   "latitude": "103.001",
 *   "longitude": "103.001",
 *   "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *   "deviceId": "01234567890123456789",
 *   "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *   "status": "new"
 * }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addDevice = function (req, res) {
  "use strict";

  if (!req || !req.body) return res.sendStatus(400);

  var device = new Device();
  device.uuid = utils.getUuid();
  device.timestamp = utils.getTimestamp();
  device.deviceId = req.body.deviceId;
  device.name = req.body.name;
  device.latitude = req.body.latitude;
  device.longitude = req.body.longitude;
  device.status = req.body.status;
  device.deviceType = req.body.deviceType;

  if (req.body.client !== undefined) device.client = req.body.client;

  Validator.isValidCredentials(req)
  .then(result => { return DeviceManagementService.addDevice(device); })
  .then(savedDevice => { return res.status('201').send(savedDevice); })
  .catch(err => { return res.sendStatus(err); });
};

/**
 * @api {put} /devices/:uuid Update an existing device
 * @apiName updateDevice
 * @apiGroup Device
 *
 * @apiParam (device) {json} Give a device as JSON.
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 *   {
 *     "name":"Device 01",
 *     "latitude":"100.001",
 *     "longitude":"100.001",
 *     "status":"new",
 *     "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *     "deviceId": "01234567890123456789",
 *     "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *     "status": "registered"
 *   },
 * All the fields above are optional. Send in only the fields you want to change with new values.
 * Only those fields will be updated.  Other fields will be left as it is.
 *
 * @apiSuccess (200) {Device} Updated device is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "uuid": "22e0805a-7002-4ae7-be1e-4877dd59fc04",
 *   "timestamp": 1483155714863,
 *   "name": "device 100",
 *   "latitude": "103.001",
 *   "longitude": "103.001",
 *   "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *   "deviceId": "01234567890123456789",
 *   "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *   "status": "new"
 * }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
 exports.updateDevice = (req, res) => {
   "use strict";

   if (!req || !req.body) return res.sendStatus(400);

   var uuid = req.params.uuid;
   var device = new Device();
   device.uuid = uuid;
   if (req.body.deviceId !== undefined) device.deviceId = req.body.deviceId;
   if (req.body.name !== undefined) device.name = req.body.name;
   if (req.body.latitude !== undefined) device.latitude = req.body.latitude;
   if (req.body.longitude !== undefined) device.longitude = req.body.longitude;
   if (req.body.status !== undefined) device.status = req.body.status;
   if (req.body.deviceType !== undefined) device.deviceType = req.body.deviceType;
   if (req.body.client !== undefined) device.client = req.body.client;

  Validator.isValidCredentials(req)
  .then(result => { return DeviceManagementService.updateDevice(device); })
  .then(response => { return res.sendStatus(response); })
  .catch(err => {
    console.log('\nerr: ' + err.stack);
    reject(err);
  });
 };
