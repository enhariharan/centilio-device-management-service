module.exports = function(grunt) {
  'use strict';

  // configure plugins
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cafemocha: {
      all: {
        src: 'qa/tests-*.js',
        options: {ui: 'tdd'},
      }
    },

    jshint: {
      app: [
        'centilio_device_management_service.js',
        'public/js/**/*.js',
        'lib/**/*.js'
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
        files: ['public/**/*.js', '/*.js'],
        tasks: [ 'cafemocha', 'jshint', 'exec' ],
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