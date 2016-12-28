# centilio-device-management-server
[![Build Status](https://secure.travis-ci.org/hariharan/temp.png?branch=master)](http://travis-ci.org/hariharan/temp)

Centilio device management service

## Getting Started
- Clone the "develop" branch
$ git clone git@github.com:enhariharan/centilio-device-management-service.git

- Change into root folder of the project and install all dependencies
$ npm install

- Modify a file credentials.js locally to give production, development, and test
 mode credentials.

- To start the server in development mode, do this.
$ npm start
[or]
$ NODE_ENV=development npm start

- To start the server in production mode, do this.
$ NODE_ENV=production npm start

- To include the module from another module, do this.
```javascript
var server = require('centilio-device-management-server');
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2016 Hariharan Narayanan  
Licensed under the UNLICENSED license.
