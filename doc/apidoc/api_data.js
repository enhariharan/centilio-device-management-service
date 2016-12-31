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
            "field": "Give",
            "description": "<p>a client as JSON</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-header \"Content-Type: application/json\" must be set.  Request-Example:",
          "content": "{\n  \"name\": \"centilio\",\n  \"type\": \"corporate\"",
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
            "field": "Created",
            "description": "<p>client is returned as JSON.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  \"uuid\": \"1eebec92-87a8-4300-bf88-8a5860875a71\",\n  \"timestamp\": 1483157605035,\n  \"name\": \"centilio\",\n  \"type\": \"corporate\"\n}",
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
            "description": "<p>Error code 500 is returned in case of osme error in the server.</p>"
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
    "title": "Get all available clients",
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
            "field": "devices",
            "description": "<p>Array of clients.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n  \"clients\": [\n    {\n      \"uuid\": \"491eeac5-f7c5-4c08-a19a-0dc376098702\",\n      \"timestamp\": \"2016-12-30T12:32:20.819Z\",\n      \"name\": \"Ashok Kumar\",\n      \"type\": \"retail\"\n    },\n    {\n      \"uuid\": \"491eeac5-f7c5-4c08-a19a-0dc376098612\",\n      \"timestamp\": \"2016-12-28T12:32:20.819Z\",\n      \"name\": \"Centilio\",\n      \"type\": \"corporate\"\n    },\n  ]\n}",
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
          "content": "{\n  \"name\":\"Device 01\",\n  \"latitude\":\"100.001\",\n  \"longitude\":\"100.001\",\n  \"status\":\"new\"\n},",
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
          "content": "HTTP/1.1 201 Created\n{\n  \"uuid\": \"22e0805a-7002-4ae7-be1e-4877dd59fc04\",\n  \"timestamp\": 1483155714863,\n  \"name\": \"device 100\",\n  \"latitude\": \"103.001\",\n  \"longitude\": \"103.001\",\n  \"status\": \"new\"\n}",
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
            "description": "<p>Error code 500 is returned in case of osme error in the server.</p>"
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
    "title": "Get all available devices",
    "name": "getAllDevices",
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
          "content": "HTTP/1.1 200 OK\n{\n  \"devices\":\n    [\n      {\n        \"uuid\":\"0123456789012345678901234567890123456789012345678901234567890123\",\n        \"timestamp\":\"2016-12-30T11:52:28.637Z\",\n        \"name\":\"Device 01\",\n        \"latitude\":\"100.001\",\n        \"longitude\":\"100.001\",\n        \"status\":\"new\"\n      },\n      {\n        \"uuid\":\"0123456789012345678901234567890123456789012345678901234567890124\",\n        \"timestamp\":\"2016-12-28T11:52:28.637Z\",\n        \"name\":\"Device 02\",\n        \"latitude\":\"100.001\",\n        \"longitude\":\"100.001\",\n        \"status\":\"new\"\n      },\n    ]\n}",
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
