module.exports = function(grunt) {
  'use strict';

  // configure plugins
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cafemocha: {
      all: {
        src: 'public/qa/tests-stress.js',
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
    },

    exec: {
      linkchecker: {
        cmd: 'linkchecker http://localhost:3000'
      }
    },

    watch: {
      scripts: {
        files: [
          'centilio-*.js',
          'routes.js',
          'controllers/*.js',
          'models/*.js',
          'views/*.js',
          'public/**/*.js'
          ],
        tasks: ['cafemocha', 'jshint', 'exec' ],
      },
    },
  });

  // load plugins
  [
    'grunt-cafe-mocha',
    'grunt-contrib-jshint',
    'grunt-exec',
    'grunt-contrib-watch'
  ].forEach(function(task) {
    grunt.loadNpmTasks(task);
  });

  // register tasks
  grunt.registerTask('default', ['cafemocha', 'jshint', 'exec', 'watch']);
};
