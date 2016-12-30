var Client = require('../models/client-model.js');

exports.getAllClients = function(callback) {
  Client.find(function (err, clients) {
    if (err) {
      console.error('error while reading clients from DB = ' + err);
      return callback(err, null);
    }

    if (!clients.length) {
      console.info('No clients found in DB...');
      return callback(0, null);
    }

    var context = {
      clients: clients.map(function(client) {
        var cli = {
          uuid: client.uuid,
          timestamp: client.timestamp,
          name: client.name,
          type: client.type,
        };
        return cli;
      }),
    };
    return callback(0, context);
  });
}

exports.addClient = function(client, callback) {
  var clientToSave = new Client(client);
  clientToSave.save(function(err) {
    if (err) {
      console.log('Error while saving client to database.');
    }
    return callback(err);
  });
}
