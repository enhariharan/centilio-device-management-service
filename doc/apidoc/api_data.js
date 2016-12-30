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
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "Client",
            "optional": false,
            "field": "Created",
            "description": "<p>clients is returned as JSON.</p>"
          }
        ]
      }
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
            "type": "Device",
            "optional": false,
            "field": "Give",
            "description": "<p>a device as JSON</p>"
          }
        ]
      }
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
      }
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
