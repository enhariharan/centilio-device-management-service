module.exports = {
  server: {
    port: 4123,
  },
  mongo: {
    development: {connectionString: 'mongodb://localhost/device-management-service-development',},
    test: {connectionString: 'mongodb://localhost/device-management-service-development',},
    production: {connectionString: 'mongodb://produser:resudorp@ds145158.mlab.com:45158/idhan-prod',},
  },
};
