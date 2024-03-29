module.exports = function(grunt) {
  'use strict';

  // configure plugins
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cafemocha: {
      all: {
        src: [
          'public/qa/tests-stress.js',
          'public/qa/tests-unit-client-management-service.js',
          'public/qa/tests-integ-login-controller.js',
          'public/qa/tests-integ-device-readings-controller.js',
          'public/qa/tests-integ-devices-controller.js'
          'public/qa/tests-integ-push-notifications.js',
        ],
        options: {ui: 'tdd'},
      }
    },

    jshint: {
      app: [
        'centilio-*.js',
        'routes.js',
        'controllers/*.js',
        'models/*.js',
        'views/*.js',
      ],
      qa: [
        'Gruntfile.js',
        'public/qa/**/*.js',
        'qa/**/*.js'
      ],
      options: {
        esversion: 6
      }
    },

    exec: {
      linkchecker: {
        cmd: 'linkchecker http://localhost:4123'
      }
    },

    apidoc: {
      myapp: {
        src: "./",
        dest: "doc/apidoc/",
        options : {
          excludeFilters: [
            "node_modules/",
            "models/",
            "public/",
            "services/",
            "views/",
          ],
          debug: true,
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'centilio-*.js',
          'routes.js',
          'controllers/*.js',
          'services/*.js',
          'models/*.js',
          'views/*.js',
          'public/**/*.js'
          ],
        tasks: ['cafemocha', 'jshint', /*'exec',*/ 'apidoc'],
      },
    },
  });

  // load plugins
  [
    'grunt-cafe-mocha',
    'grunt-contrib-jshint',
    'grunt-exec',
    'grunt-contrib-watch',
    'grunt-apidoc',
  ].forEach(function(task) {
    grunt.loadNpmTasks(task);
  });

  // register tasks
  grunt.registerTask('default', ['cafemocha', 'jshint', /*'exec',*/ 'apidoc', 'watch']);
};
