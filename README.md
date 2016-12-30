# centilio-device-management-server
[![Build Status](https://secure.travis-ci.org/hariharan/temp.png?branch=master)](http://travis-ci.org/hariharan/temp)

Centilio device management service

## Getting Started
- If nodejs 6.9.2 LTS is not installed then install it first.  Instructions for Ubuntu are given below.
``` bash
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
For other OS, please refer to this URL: https://nodejs.org/en/download/
```

- If mongodb is not installed then install it next.  Instructions can be found from this URL: https://www.mongodb.com/download-center#community; Instructions for Ubuntu Linux are given below:
``` bash
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
$ echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
$ sudo service mongod start
```

- Clone the "develop" branch
``` bash
$ git clone git@github.com:enhariharan/centilio-device-management-service.git
```

- Change into root folder of the project and install all dependencies
``` bash
$ npm install
```

- Modify a file credentials.js locally to give production, development, and test
 mode credentials.

- To start the server in development mode, do this.
``` bash
$ npm start
```
[or]
``` bash
$ NODE_ENV=development npm start
```

- To start the server in production mode, do this.
``` bash
$ NODE_ENV=production npm start
```

- By default, the server is started in cluster mode. That means 1 server instance is started on each CPU core. Instead, if you want only a single instance of the server to be started, then execute the below command
```bash
$ NODE_ENV=<enter-your-mode> node centilio-device-management-service.js
```

- The server starts on port 4123 by default. To change port, update the value of server.port in credentials.js.

## Documentation
_Please refer to the doc folder in the project root directory for the documentation_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2016 Hariharan Narayanan  
Licensed under the UNLICENSED license.
