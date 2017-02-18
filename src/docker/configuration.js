var configuration = {
  server: {
    port: 4123,
  },
  mongo: {
    development: {connectionString: 'mongodb://centilio-db/device-management-service-development',},
    test: {connectionString: 'mongodb://centilio-db/device-management-service-test',},
    production: {connectionString: 'mongodb://produser:resudorp@ds145158.mlab.com:45158/device-management-service-prod',},
  },
};

var getDbConnection = (env) => {
  switch(env) {
    case 'development': return configuration.mongo.development.connectionString;
    case 'test': return configuration.mongo.test.connectionString;
    case 'production': return configuration.mongo.production.connectionString;
    default: return null;
  }
}

var getPort = (env) => { return configuration.server.port; }

module.exports = {getDbConnection, getPort};
