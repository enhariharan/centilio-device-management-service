var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();

var main = require('./controllers/main.js');
var devices = require('./controllers/devices-controller.js');
var clients = require('./controllers/clients-controller.js');
var roles = require('./controllers/roles-controller.js');

module.exports = function(app) {
  "use strict";

  app.use(jsonParser);

  app.get("/", main.home);
  app.get('/about', main.about);

  app.get('/devices', devices.getAllDevices);
  app.post('/devices', jsonParser, devices.addDevice);

  app.get('/clients', clients.getAllClients);
  app.get('/clients/:uuid', clients.getClientById);
  app.post('/clients', jsonParser, clients.addClient);

  app.get('/roles', roles.getAllRoles);
  app.post('/roles', jsonParser, roles.addRole);
};
