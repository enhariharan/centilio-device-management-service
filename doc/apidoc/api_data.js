define({ "api": [
  {
    "type": "post",
    "url": "/clients",
    "title": "Add a new client",
    "name": "addClient",
    "group": "Client",
    "parameter": {
      "fields": {
        "client": [
          {
            "group": "client",
            "type": "Client",
            "optional": false,
            "field": "client",
            "description": "<p>Give a client as JSON</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-header \"Content-Type: application/json\" must be set.  Request-Example:",
          "content": "{\n  \"corporateName\": \"AB Inc\",\n  \"firstName\" : \"John\",\n  \"lastName\" : \"Doe\",\n  \"type\": \"corporate\",\n  \"addresses\": [{\n    \"line1\": \"123, ABC Road\",\n    \"line2\": \"DEF Blvd\",\n    \"city\": \"GHIJK City\",\n    \"state\": \"LM State\",\n    \"countryCode\": \"IN\",\n    \"zipCode\": \"NOPQRS\",\n    \"latitude\": \"100.01\",\n    \"longitude\": \"100.01\",\n    \"type\": \"work\"\n  }],\n  \"emails\": [{\n    \"email\": \"ashok.kumar@centilio.com\",\n    \"type\": \"work\"\n  }],\n  \"contactNumbers\": [{\n    \"number\": \"+919972012345\",\n    \"type\": \"work\"\n  }],\n  \"role\" : \"user\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "Client",
            "optional": false,
            "field": "client",
            "description": "<p>Created client is returned as JSON.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error code 400 is returned if the JSON format is incorrect.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error code 500 is returned in case of some error in the server.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/clients-controller.js",
    "groupTitle": "Client",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//clients"
      }
    ]
  },
  {
    "type": "get",
    "url": "/clients",
    "title": "Get all available clients according to these rules - (1) If logged in as admin, then all users belonging to his/her company are returned; (2) If not logged in as admin, then error code 403 is returned.",
    "name": "getAllClients",
    "group": "Client",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "None",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Client[]",
            "optional": false,
            "field": "clients",
            "description": "<p>Array of clients.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"clients\": [\n    {\n      \"uuid\": \"491eeac5-f7c5-4c08-a19a-0dc376098702\",\n      \"timestamp\": \"2016-12-30T12:32:20.819Z\",\n      \"name\": \"Ashok Kumar\",\n      \"type\": \"retail\"\n      \"addresses\" :\n        [\n          {\n            \"line1\" : \"123, ABC Road\",\n            \"line2\" : \"DEF Blvd\",\n            \"city\" : \"GHIJK City\",\n            \"state\" : \"LM State\",\n            \"countryCode\" : \"IN\",\n            \"zipCode\" : \"NOPQRS\",\n            \"latitude\" : \"100.01\",\n            \"longitude\" : \"100.01\",\n            \"type\" : \"work\",\n            \"uuid\" : \"9eab071b-529a-4175-8033-7043a8fcc510\",\n            \"timestamp\" : ISODate(\"2016-12-31T06:34:50.615Z\"),\n            \"status\" : \"active\",\n            \"_id\" : ObjectId(\"5867518afc5bcb32f456f9c5\") *              },\n          },\n          {\n            \"line1\" : \"Address line 1\",\n            \"line2\" : \"Address line 2\",\n            \"city\" : \"City name\",\n            \"state\" : \"State Code\",\n            \"countryCode\" : \"country Code\",\n            \"zipCode\" : \"ZiPCoDe\",\n            \"latitude\" : \"100.01\",\n            \"longitude\" : \"100.01\",\n            \"type\" : \"home\",\n            \"uuid\" : \"9eab071b-529a-4175-8033-7043a8fcc510\",\n            \"timestamp\" : ISODate(\"2016-12-31T06:34:50.615Z\"),\n            \"status\" : \"active\",\n            \"_id\" : ObjectId(\"5867518afc5bcb32f456f9c5\")\n          },\n        ]\n    },\n    {\n      \"uuid\": \"491eeac5-f7c5-4c08-a19a-0dc376098612\",\n      \"timestamp\": \"2016-12-28T12:32:20.819Z\",\n      \"name\": \"Centilio\",\n      \"type\": \"corporate\"\n    },\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/clients-controller.js",
    "groupTitle": "Client",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//clients"
      }
    ]
  },
  {
    "type": "get",
    "url": "/clients/:uuid",
    "title": "Get client by given uuid",
    "name": "getClient",
    "group": "Client",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "None",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Client[]",
            "optional": false,
            "field": "Clients",
            "description": "<p>JSON array of 1 client having given uuid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n  \"clients\": [\n    {\n      \"uuid\": \"491eeac5-f7c5-4c08-a19a-0dc376098702\",\n      \"timestamp\": \"2016-12-30T12:32:20.819Z\",\n      \"name\": \"Ashok Kumar\",\n      \"type\": \"retail\"\n      \"addresses\" :\n        [\n          {\n            \"line1\" : \"123, ABC Road\",\n            \"line2\" : \"DEF Blvd\",\n            \"city\" : \"GHIJK City\",\n            \"state\" : \"LM State\",\n            \"countryCode\" : \"IN\",\n            \"zipCode\" : \"NOPQRS\",\n            \"latitude\" : \"100.01\",\n            \"longitude\" : \"100.01\",\n            \"type\" : \"work\",\n            \"uuid\" : \"9eab071b-529a-4175-8033-7043a8fcc510\",\n            \"timestamp\" : ISODate(\"2016-12-31T06:34:50.615Z\"),\n            \"status\" : \"active\",\n            \"_id\" : ObjectId(\"5867518afc5bcb32f456f9c5\") *              },\n          },\n          {\n            \"line1\" : \"Address line 1\",\n            \"line2\" : \"Address line 2\",\n            \"city\" : \"City name\",\n            \"state\" : \"State Code\",\n            \"countryCode\" : \"country Code\",\n            \"zipCode\" : \"ZiPCoDe\",\n            \"latitude\" : \"100.01\",\n            \"longitude\" : \"100.01\",\n            \"type\" : \"home\",\n            \"uuid\" : \"9eab071b-529a-4175-8033-7043a8fcc510\",\n            \"timestamp\" : ISODate(\"2016-12-31T06:34:50.615Z\"),\n            \"status\" : \"active\",\n            \"_id\" : ObjectId(\"5867518afc5bcb32f456f9c5\")\n          },\n        ]\n    },\n    {\n      \"uuid\": \"491eeac5-f7c5-4c08-a19a-0dc376098612\",\n      \"timestamp\": \"2016-12-28T12:32:20.819Z\",\n      \"name\": \"Centilio\",\n      \"type\": \"corporate\"\n    },\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/clients-controller.js",
    "groupTitle": "Client",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//clients/:uuid"
      }
    ]
  },
  {
    "type": "post",
    "url": "/deviceParams",
    "title": "Add a new device param",
    "name": "addDeviceParam",
    "group": "Device_Params",
    "parameter": {
      "fields": {
        "deviceParam": [
          {
            "group": "deviceParam",
            "type": "json",
            "optional": false,
            "field": "deviceParam",
            "description": "<p>Give a device param as JSON.  UUID and timestamp are automatically generated.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-header \"Content-Type: application/json\" must be set.  Request-Example:",
          "content": "{\n  \"name\": Temperature\",\n  \"description\":\"Temperature of the device\",\n  \"deviceType\": {\n    \"uuid\": \"bd1dbf4f-c708-44d9-8dc1-8498d8f4923d\"\n  }\n},",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "DeviceParam",
            "optional": false,
            "field": "deviceParam",
            "description": "<p>Created device params is returned as JSON.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  \"uuid\": \"22e0805a-7002-4ae7-be1e-4877dd59fc04\",\n  \"timestamp\": 1483155714863,\n  \"name\": \"temperature\",\n  \"description\": \"Temperature of the device\",\n  \"deviceType\": {\n    \"uuid\": \"bd1dbf4f-c708-44d9-8dc1-8498d8f4923d\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error code 400 is returned if the JSON format is incorrect.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error code 500 is returned in case of some error in the server.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/device-params-controller.js",
    "groupTitle": "Device_Params",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//deviceParams"
      }
    ]
  },
  {
    "type": "get",
    "url": "/deviceParams",
    "title": "Get all available device params",
    "name": "getAllDeviceParams",
    "group": "Device_Params",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "None",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "DeviceParam[]",
            "optional": false,
            "field": "deviceParams",
            "description": "<p>Array of device params.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"deviceParams\": [\n    {\n      \"uuid\": \"31d6c240-291b-4130-b706-4b2fe6e0f090\",\n      \"timestamp\": \"2017-01-05T09:10:44.629Z\",\n      \"name\": \"latitude\",\n      \"deviceType\": \"bd1dbf4f-c708-44d9-8dc1-8498d8f4923d\"\n    },\n    {\n      \"uuid\": \"7c806c7c-c10d-4302-ac52-664ca0cc3d7e\",\n      \"timestam\": \"2017-01-05T09:11:21.991Z\",\n      \"name\": \"longitude\",\n      \"deviceType\": \"bd1dbf4f-c708-44d9-8dc1-8498d8f4923d\"\n    },\n    {\n      \"uuid\": \"a07a0400-65b4-41be-8ab5-2c13f01e06c3\",\n      \"timestamp\": \"2017-01-05T09:12:57.119Z\",\n      \"name\": \"temperature\",\n      \"deviceType\": \"bd1dbf4f-c708-44d9-8dc1-8498d8f4923d\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/device-params-controller.js",
    "groupTitle": "Device_Params",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//deviceParams"
      }
    ]
  },
  {
    "type": "get",
    "url": "/deviceParams/:uuid",
    "title": "Get device param by given uuid",
    "name": "getDeviceParam",
    "group": "Device_Params",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "None",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "DeviceParam",
            "optional": false,
            "field": "deviceParam",
            "description": "<p>JSON having given uuid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"deviceParams\": [\n    {\n      \"uuid\": \"31d6c240-291b-4130-b706-4b2fe6e0f090\",\n      \"timestamp\": \"2017-01-05T09:10:44.629Z\",\n      \"name\": \"latitude\",\n      \"deviceType\": \"bd1dbf4f-c708-44d9-8dc1-8498d8f4923d\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/device-params-controller.js",
    "groupTitle": "Device_Params",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//deviceParams/:uuid"
      }
    ]
  },
  {
    "type": "post",
    "url": "/deviceReadings",
    "title": "Add a new device reading",
    "name": "addDeviceReading",
    "group": "Device_Readings",
    "parameter": {
      "fields": {
        "deviceReading": [
          {
            "group": "deviceReading",
            "type": "json",
            "optional": false,
            "field": "deviceReading",
            "description": "<p>Give a device reading as JSON.  UUID and timestamp are automatically generated.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-header \"Content-Type: application/json\" must be set.  Request-Example:",
          "content": "{\n  \"device\":\"0a1da6bc-eb49-4f31-9bb1-83ed46c1eb80\",\n  \"timestamp\": 1483625834968,\n  \"readings\":\n    [\n      {\n        \"type\": \"latitude\",\n        \"value\": \"100.01\"\n      },\n      {\n        \"type\": \"longitude\",\n        \"value\": \"100.01\"\n      },\n      {\n        \"type\": \"charging status\",\n        \"value\": \"discharging\"\n      },\n      {\n        \"type\": \"current charge\",\n        \"value\": \"85\"\n      }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "DeviceReading",
            "optional": false,
            "field": "deviceReading",
            "description": "<p>Created device reading is returned as JSON.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  \"uuid\": \"6a91cf1d-e241-48c7-955d-4cd470ec5afb\",\n  \"timestamp\": 1483625834968,\n  \"serverTimestamp\": 1483625834968,\n  \"device\": \"0a1da6bc-eb49-4f31-9bb1-83ed46c1eb80\",\n  \"readings\":\n    [\n      {\n        \"type\": \"latitude\",\n        \"value\": \"100.01\"\n      },\n      {\n        \"type\": \"longitude\",\n        \"value\": \"100.01\"\n      },\n      {\n        \"type\": \"charging status\",\n        \"value\": \"discharging\"\n      },\n      {\n        \"type\": \"current charge\",\n        \"value\": \"85\"\n      }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error code 400 is returned if the JSON format is incorrect.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error code 500 is returned in case of some error in the server.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/device-readings-controller.js",
    "groupTitle": "Device_Readings",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//deviceReadings"
      }
    ]
  },
  {
    "type": "get",
    "url": "/deviceReadings",
    "title": "Get device readings of all devices belonging to the logged in user.",
    "name": "getAllDeviceReadings",
    "group": "Device_Readings",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "latestOnly",
            "description": "<ul> <li>If this param is set to true (/devicereadings?latestOnly=true) then only the latest reading per device is returned.  Else all device readings of all devices of the user are returned.</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "DeviceReadings[]",
            "optional": false,
            "field": "deviceReadings",
            "description": "<p>Array of device readings.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"deviceReadings\": [\n    {\n      \"uuid\": \"caf95dc0-3a6c-44e1-9fee-545f22b43b5c\",\n      \"timestamp\": \"2017-01-05T12:47:08.240Z\",\n      \"serverTimestamp\": \"2017-01-05T14:17:14.968Z\",\n      \"readings\": [\n        {\n          \"type\": \"latitude\",\n          \"value\": \"100.01\",\n          \"_id\": \"586e404cc3bbdf51608a5320\"\n        },\n        {\n          \"type\": \"longitude\",\n          \"value\": \"100.01\",\n          \"_id\": \"586e404cc3bbdf51608a531f\"\n        }\n      ]\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/device-readings-controller.js",
    "groupTitle": "Device_Readings",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//deviceReadings"
      }
    ]
  },
  {
    "type": "get",
    "url": "/deviceReadings/:uuid",
    "title": "Get device reading by given uuid",
    "name": "getDeviceReading",
    "group": "Device_Readings",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "None",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "DeviceReading",
            "optional": false,
            "field": "deviceReading",
            "description": "<p>JSON having given uuid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"deviceReadings\": [\n    {\n    \"uuid\": \"6a91cf1d-e241-48c7-955d-4cd470ec5afb\",\n    \"timestamp\": \"2017-01-05T14:17:14.968Z\",\n    \"serverTimestamp\": \"2017-01-05T14:17:14.968Z\",\n    \"device\": \"0a1da6bc-eb49-4f31-9bb1-83ed46c1eb80\",\n    \"readings\": [\n    {\n      \"type\": \"latitude\",\n      \"value\": \"100.01\",\n      \"_id\": \"586e556a0f758160e6df6fbf\"\n    },\n    {\n      \"type\": \"longitude\",\n      \"value\": \"100.01\",\n      \"_id\": \"586e556a0f758160e6df6fbe\"\n    }\n  ]\n},\n{\n  \"uuid\": \"047919ce-2d97-4ee3-ab55-80fb3ebd433a\",\n  \"timestamp\": \"2017-01-05T14:34:29.561Z\",\n  \"serverTimestamp\": \"2017-01-05T14:17:14.968Z\",\n  \"device\": \"0a1da6bc-eb49-4f31-9bb1-83ed46c1eb80\",\n  \"readings\":\n    [\n      {\n        \"type\": \"latitude\",\n        \"value\": \"100.01\",\n        \"_id\": \"586e5975161aba63da03687c\"\n      },\n      {\n        \"type\": \"longitude\",\n        \"value\": \"100.01\",\n        \"_id\": \"586e5975161aba63da03687b\"\n      },\n      {\n        \"type\": \"charging status\",\n        \"value\": \"discharging\"\n      },\n      {\n        \"type\": \"current charge\",\n        \"value\": \"85\"\n      }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/device-readings-controller.js",
    "groupTitle": "Device_Readings",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//deviceReadings/:uuid"
      }
    ]
  },
  {
    "type": "post",
    "url": "/devicetypes",
    "title": "Add a new device type",
    "name": "addDeviceType",
    "group": "Device_Type",
    "parameter": {
      "fields": {
        "deviceType": [
          {
            "group": "deviceType",
            "type": "json",
            "optional": false,
            "field": "deviceType",
            "description": "<p>Give a device type as JSON.  UUID and timestamp are automatically generated.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-header \"Content-Type: application/json\" must be set.  Request-Example:",
          "content": "{\n  \"name\": \"mobile\",\n  \"status\": \"active\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "DeviceType",
            "optional": false,
            "field": "deviceType",
            "description": "<p>Created device types is returned as JSON.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  \"uuid\": \"bd1dbf4f-c708-44d9-8dc1-8498d8f4923d\",\n  \"timestamp\": 1483598767702,\n  \"name\": \"mobile\",\n  \"status\": \"active\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error code 400 is returned if the JSON format is incorrect.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error code 500 is returned in case of some error in the server.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/device-types-controller.js",
    "groupTitle": "Device_Type",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//devicetypes"
      }
    ]
  },
  {
    "type": "get",
    "url": "/deviceTypes",
    "title": "Get all available device types",
    "name": "getAllDeviceTypes",
    "group": "Device_Type",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "None",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "DeviceType[]",
            "optional": false,
            "field": "deviceTypes",
            "description": "<p>Array of device types.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"deviceTypes\": [\n    {\n      \"uuid\": \"54d278f8-4068-45c5-950d-cd8c83d37b44\",\n      \"timestamp\": \"2017-01-05T06:21:41.808Z\",\n      \"name\": \"smart light\",\n      \"status\": \"active\"\n    },\n    {\n      \"uuid\": \"38ff54e1-ec5f-4c4a-861e-95252560289c\",\n      \"timestamp\": \"2017-01-05T06:36:51.736Z\",\n      \"name\": \"mobile\",\n      \"status\": \"active\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/device-types-controller.js",
    "groupTitle": "Device_Type",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//deviceTypes"
      }
    ]
  },
  {
    "type": "get",
    "url": "/devicetypes/:uuid",
    "title": "Get device type by given uuid",
    "name": "getDeviceType",
    "group": "Device_Type",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "None",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "DeviceType",
            "optional": false,
            "field": "deviceType",
            "description": "<p>JSON of device type having given uuid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"deviceTypes\": [\n    {\n      \"uuid\": \"38ff54e1-ec5f-4c4a-861e-95252560289c\",\n      \"timestamp\": \"2017-01-05T06:36:51.736Z\",\n      \"name\": \"mobile\",\n      \"status\": \"active\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/device-types-controller.js",
    "groupTitle": "Device_Type",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//devicetypes/:uuid"
      }
    ]
  },
  {
    "type": "post",
    "url": "/devices",
    "title": "Add a new device",
    "name": "addDevice",
    "group": "Device",
    "parameter": {
      "fields": {
        "device": [
          {
            "group": "device",
            "type": "json",
            "optional": false,
            "field": "Give",
            "description": "<p>a device as JSON.  UUID and timestamp are automatically generated.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-header \"Content-Type: application/json\" must be set.  Request-Example:",
          "content": "{\n  \"name\":\"Device 01\",\n  \"latitude\":\"100.001\",\n  \"longitude\":\"100.001\",\n  \"status\":\"new\",\n  \"deviceType\":\"5612d680-e008-4482-97e2-0391ce5d3994\",\n  \"deviceId\": \"01234567890123456789\",\n  \"client\": \"b42f0bad-5a1d-485d-a0f2-308b8f53aed0\"\n},",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "Device",
            "optional": false,
            "field": "Created",
            "description": "<p>devices is returned as JSON.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  \"uuid\": \"22e0805a-7002-4ae7-be1e-4877dd59fc04\",\n  \"timestamp\": 1483155714863,\n  \"name\": \"device 100\",\n  \"latitude\": \"103.001\",\n  \"longitude\": \"103.001\",\n  \"deviceType\":\"5612d680-e008-4482-97e2-0391ce5d3994\",\n  \"deviceId\": \"01234567890123456789\",\n  \"client\": \"b42f0bad-5a1d-485d-a0f2-308b8f53aed0\"\n  \"status\": \"new\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error code 400 is returned if the JSON format is incorrect.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error code 500 is returned in case of some error in the server.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/devices-controller.js",
    "groupTitle": "Device",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//devices"
      }
    ]
  },
  {
    "type": "get",
    "url": "/devices",
    "title": "Get all available devices belonging to logged in user",
    "name": "getAllDevices",
    "group": "Device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "Request-header",
            "description": "<p>must contain the credentials of logged in user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Device[]",
            "optional": false,
            "field": "devices",
            "description": "<p>Array of devices.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"devices\": [{\n    \"uuid\":\"0123456789012345678901234567890123456789012345678901234567890123\",\n    \"timestamp\":\"2016-12-30T11:52:28.637Z\",\n    \"name\":\"Device 01\",\n    \"latitude\":\"100.001\",\n    \"longitude\":\"100.001\",\n    \"deviceType\":\"5612d680-e008-4482-97e2-0391ce5d3994\",\n    \"deviceId\":\"01234567890123456789\",\n    \"client\": \"b42f0bad-5a1d-485d-a0f2-308b8f53aed0\"\n    \"status\":\"new\"\n  },\n  {\n    \"uuid\":\"0123456789012345678901234567890123456789012345678901234567890124\",\n    \"timestamp\":\"2016-12-28T11:52:28.637Z\",\n    \"name\":\"Device 02\",\n    \"latitude\":\"100.001\",\n    \"longitude\":\"100.001\",\n    \"deviceType\":\"5612d680-e008-4482-97e2-0391ce5d3994\",\n    \"deviceId\":\"01234567890123456789\",\n    \"client\": \"b42f0bad-5a1d-485d-a0f2-308b8f53aed0\"\n    \"status\":\"new\"\n  }]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/devices-controller.js",
    "groupTitle": "Device",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//devices"
      }
    ]
  },
  {
    "type": "get",
    "url": "/devices/:id",
    "title": "Get device by given uuid or deviceId",
    "name": "getDevice",
    "group": "Device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "Request-header",
            "description": "<p>must contain the credentials of logged in user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Device",
            "optional": false,
            "field": "Device",
            "description": "<p>JSON having given uuid or deviceId.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"devices\": [{\n    \"uuid\":\"0123456789012345678901234567890123456789012345678901234567890123\",\n    \"timestamp\":\"2016-12-30T11:52:28.637Z\",\n    \"name\":\"Device 01\",\n    \"latitude\":\"100.001\",\n    \"longitude\":\"100.001\",\n    \"status\":\"new\"\n    \"deviceType\":\"5612d680-e008-4482-97e2-0391ce5d3994\",\n    \"deviceId\": \"01234567890123456789\",\n    \"client\": \"b42f0bad-5a1d-485d-a0f2-308b8f53aed0\"\n  }]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/devices-controller.js",
    "groupTitle": "Device",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//devices/:id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/devices/:uuid/deviceReadings",
    "title": "Get device readings by given device uuid",
    "name": "getDeviceReadingsByDeviceUuid",
    "group": "Device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "None",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Device",
            "optional": false,
            "field": "Device",
            "description": "<p>readings array as JSON.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n   \"deviceReadings\": [{\n     \"uuid\": \"f982cea9-d271-445d-a937-6a5dafef6d29\",\n     \"timestamp\": \"2017-01-18T07:14:34.472Z\",\n     \"device\": \"20e7edea-0db9-4595-844f-c42b1b6e3951\",\n     \"readings\": [{\n         \"type\": \"latitude\",\n         \"value\": \"100.01\",\n         \"_id\": \"587f15da8636f73e30eff809\"\n       }, {\n         \"type\": \"longitude\",\n         \"value\": \"100.001\",\n         \"_id\": \"587f15da8636f73e30eff808\"\n       }, {\n         \"type\": \"charging status\",\n         \"value\": \"charging\",\n         \"_id\": \"587f15da8636f73e30eff807\"\n       }, {\n         \"type\": \"current charge\",\n         \"value\": \"80\",\n         \"_id\": \"587f15da8636f73e30eff806\"\n       }]\n   },\n   ...\n   ...\n]}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/devices-controller.js",
    "groupTitle": "Device",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//devices/:uuid/deviceReadings"
      }
    ]
  },
  {
    "type": "post",
    "url": "/roles",
    "title": "Add a new role",
    "name": "addRole",
    "group": "Role",
    "parameter": {
      "fields": {
        "role": [
          {
            "group": "role",
            "type": "Role",
            "optional": false,
            "field": "Role",
            "description": "<p>Give a role as JSON</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-header \"Content-Type: application/json\" must be set.  Request-Example:",
          "content": "{\n  \"name\": \"adminstrator\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "Role",
            "optional": false,
            "field": "Role",
            "description": "<p>Created role is returned as JSON.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n\"uuid\": \"88b28115-b859-452c-9fb4-5323c9ed69e6\",\n\"timestamp\": 1483166090614,\n\"name\": \"AB Inc\",\n\"status\": \"active\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error code 400 is returned if the JSON format is incorrect.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error code 500 is returned in case of some error in the server.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/roles-controller.js",
    "groupTitle": "Role",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//roles"
      }
    ]
  },
  {
    "type": "get",
    "url": "/roles",
    "title": "Get all available roles",
    "name": "getAllRoles",
    "group": "Role",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "None",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Role[]",
            "optional": false,
            "field": "Roles",
            "description": "<p>Array of roles.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n  \"roles\": [\n    {\n      \"uuid\": \"491eeac5-f7c5-4c08-a19a-0dc376098702\",\n      \"timestamp\": \"2016-12-30T12:32:20.819Z\",\n      \"name\": \"admininstrator\",\n      \"status\": \"active\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/roles-controller.js",
    "groupTitle": "Role",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//roles"
      }
    ]
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Add a new user",
    "name": "addUser",
    "group": "User",
    "parameter": {
      "fields": {
        "user": [
          {
            "group": "user",
            "type": "Credentials",
            "optional": false,
            "field": "credentials",
            "description": "<p>Credentials of the logged in user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-header \"Content-Type: application/json\" must be set.",
          "content": "                 {json} Request-header Basic Authentication details must ne set. This should be changed to\n                        stateless JWT based token based authentication.\n                 {json} Request-body should send the new user name, passsword, role type in the following format.\n{\n  \"firstName\": \"John\",\n  \"lastName\": \"Woo\",\n  \"email\": \"john.woo@centil.io\",\n  \"password\": \"password\", // TODO: This should be changed to stateless JWT based token based authentication.\n  \"role\": \"83356361-e0a4-4942-98b8-1a1c8ad4c943\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "User",
            "optional": false,
            "field": "user",
            "description": "<p>Created user is returned as JSON.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error code 400 is returned if the JSON format is incorrect.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error code 500 is returned in case of some error in the server.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/user-controller.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//users"
      }
    ]
  },
  {
    "type": "get",
    "url": "/login",
    "title": "login into the device manager",
    "name": "login",
    "group": "User",
    "parameter": {
      "fields": {
        "user": [
          {
            "group": "user",
            "type": "Credentials",
            "optional": false,
            "field": "credentials",
            "description": "<p>Credentials sent as authentication headera</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Client[]",
            "optional": false,
            "field": "clients",
            "description": "<p>Array of client matching the credentials.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"uuid\":\"1af2e69c-dc0b-479b-ab83-088e54977920\",\n  \"timestamp\":\"2017-01-11T03:13:20.880Z\",\n  \"corporateName\":\"corporation 1\",\n  \"firstName\":\"Ashok\",\n  \"lastName\":\"Kumar\",\n  \"middleName\":\"M\",\n  \"type\":\"corporate\",\n  \"addresses\":[\n    {\n      \"_id\":\"5875a2d0c9dcff18d0012600\",\n      \"client\":\"1af2e69c-dc0b-479b-ab83-088e54977920\",\n      \"line1\":\"123, HiTec City\",\n      \"line2\":\"\",\n      \"city\":\"Hyderabad\",\n      \"state\":\"Telangana\",\n      \"countryCode\":\"IN\",\n      \"zipCode\":\"500081\",\n      \"latitude\":\"17.447162\",\n      \"longitude\":\"78.376808\",\n      \"type\":\"work\",\n      \"status\":\"active\",\"__v\":0\n    }\n  ],\n  \"emails\":[\n    {\n      \"_id\":\"5875a2d0c9dcff18d001260a\",\n      \"client\":\"1af2e69c-dc0b-479b-ab83-088e54977920\",\n      \"email\":\"client1@corp1.com\",\n      \"type\":\"work\",\"__v\":0\n    },\n    {\n      \"_id\":\"5875a2d0c9dcff18d001260b\",\n      \"client\":\"1af2e69c-dc0b-479b-ab83-088e54977920\",\n      \"email\":\"client.1@corp1.com\",\n      \"type\":\"work\",\"__v\":0\n    },\n    {\n      \"_id\":\"5875a2d0c9dcff18d001260c\",\n      \"client\":\"1af2e69c-dc0b-479b-ab83-088e54977920\",\n      \"email\":\"client.1@gmail.com\",\n      \"type\":\"personal\",\"__v\":0\n    }\n  ],\n  \"contactNumbers\":[\n    {\n      \"_id\":\"5875a2d0c9dcff18d0012614\",\n      \"client\":\"1af2e69c-dc0b-479b-ab83-088e54977920\",\n      \"number\":\"+911234567890\",\"type\":\"work\",\"__v\":0\n    }\n  ],\n  \"devices\":[\n    {\n      \"_id\":\"5875a2d0c9dcff18d00125fc\",\n      \"uuid\":\"aeaadfde-e668-4c2c-94e5-249cb8523334\",\n      \"timestamp\":\"2017-01-11T03:13:20.882Z\",\n      \"name\":\"device 1\",\n      \"status\":\"online\",\n      \"deviceType\":\"9ebc5c0e-1a29-453f-8acd-d0ec42f0c21d\",\n      \"deviceId\":\"01234567890123456789\",\n      \"client\":\"1af2e69c-dc0b-479b-ab83-088e54977920\",\"__v\":0\n    },\n    {\n      \"_id\":\"5875a2d0c9dcff18d00125fd\",\n      \"uuid\":\"25efe540-a3ba-4156-bfbc-7b252341dca3\",\n      \"timestamp\":\"2017-01-11T03:13:20.883Z\",\n      \"name\":\"device 2\",\n      \"status\":\"online\",\n      \"deviceType\":\"9ebc5c0e-1a29-453f-8acd-d0ec42f0c21d\",\n      \"deviceId\":\"01234567890123456789\",\n      \"client\":\"1af2e69c-dc0b-479b-ab83-088e54977920\",\"__v\":0\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/login-controller.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//login"
      }
    ]
  },
  {
    "type": "put",
    "url": "/users",
    "title": "Add a new user",
    "name": "updateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "user": [
          {
            "group": "user",
            "type": "Credentials",
            "optional": false,
            "field": "credentials",
            "description": "<p>Credentials sent as authentication headera</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-header \"Content-Type: application/json\" must be set.",
          "content": "             {json} Request-header Basic Authentication details must ne set. This should be changed to stateless JWT based token based authentication.\n{\n  \"username\": \"hanglesias\",\n  \"password\": \"password\", // This is done only for the demo. JWT token based authentication should be used instead.\n  \"status\": \"activated\",\n  \"gender\": \"female\",\n  \"profilePicPath\": \"/profile/pic/path\",\n  \"client\": \"491eeac5-f7c5-4c08-a19a-0dc376098702\",\n  \"role\": \"user\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "User",
            "optional": false,
            "field": "user",
            "description": "<p>Updated user is returned as JSON.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 Created",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error code 400 is returned if the JSON format is incorrect.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error code 500 is returned in case of some error in the server.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/user-controller.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://api.centilio.com/v1//users"
      }
    ]
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/apidoc/main.js",
    "group": "_home_hariharan_work_repos_centilio_device_management_service_doc_apidoc_main_js",
    "groupTitle": "_home_hariharan_work_repos_centilio_device_management_service_doc_apidoc_main_js",
    "name": ""
  }
] });
