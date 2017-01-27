var bodyparser = require('body-parser'),
    jsonParser = bodyparser.json();

var main = require('./controllers/main'),
    devices = require('./controllers/devices-controller'),
    deviceParams = require('./controllers/device-params-controller'),
    clients = require('./controllers/clients-controller'),
    roles = require('./controllers/roles-controller'),
    deviceTypes = require('./controllers/device-types-controller'),
    deviceReadings = require('./controllers/device-readings-controller'),
    user = require('./controllers/users-controller'),
    login = require('./controllers/login-controller');

module.exports = function(app) {
  "use strict";

  app.use(jsonParser);

  app.get("/", main.home);
  app.get('/about', main.about);

  app.get('/devices', devices.getAllDevices);
  app.get('/devices/:uuid', devices.getDevice);
  app.put('/devices/:uuid', devices.updateDevice);
  app.get('/devices/:uuid/deviceReadings', devices.getDeviceReadingsByDeviceUuid);
  app.post('/devices', jsonParser, devices.addDevice);

  app.get('/deviceParams', deviceParams.getAllDeviceParams);
  app.get('/deviceParams/:uuid', deviceParams.getDeviceParam);
  app.post('/deviceParams', jsonParser, deviceParams.addDeviceParam);

  app.get('/deviceTypes', deviceTypes.getAllDeviceTypes);
  app.get('/deviceTypes/:uuid', deviceTypes.getDeviceType);
  app.post('/deviceTypes', jsonParser, deviceTypes.addDeviceType);

  app.get('/deviceReadings', deviceReadings.getAllDeviceReadings);
  app.get('/deviceReadings/:uuid', deviceReadings.getDeviceReading);
  app.post('/deviceReadings', jsonParser, deviceReadings.addDeviceReading);

  app.get('/clients', clients.getAllClients);
  app.get('/clients/:uuid', clients.getClient);
  app.post('/clients', jsonParser, clients.addClient);

  app.get('/roles', roles.getAllRoles);
  app.post('/roles', jsonParser, roles.addRole);

  app.get('/login', login.login);

  app.post('/users', user.addUser);
  app.put('/users', user.updateUser);
};
