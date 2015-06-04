/*
 * grunt-i18n
 * https://github.com/amido/grunt-i18n
 *
 * Copyright (c) 2015 Antony Koch
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var count = 1;
  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    i18n: {
        locales: ['de'],
        root: 'test',
        task: 'build'
    },

    copy: {
      main: {
        src: 'test/constants.js',
        dest: 'test.bak/constants.js'
      },
      de: {
        src: 'test/constants.js',
        dest: 'test.de.bak/constants.js'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'i18n', 'nodeunit']);
  grunt.registerTask('build', ['copy:main']);
  grunt.registerTask('build:de', ['copy:de']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
