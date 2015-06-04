/*
 * grunt-i18n
 * https://github.com/amido/grunt-i18n
 *
 * Copyright (c) 2015 Antony Koch
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('i18n', 'Browserify centric plugin that allows multiple builds, rename files with known extensions in order to provide internationalised single page apps', function() {
    var config = grunt.config.get('i18n');
    if (!config.task)
      throw new Error('i18n: task must be supplied');

    if (!config.locales.length)
      throw new Error('i18n: locales must contain at least one value');

    grunt.task.run(config.task);
    var root = config.root || '.';
    var task = config.task;
    config.locales.forEach(function(locale) {
      var preName = 'i18n-' + locale + '-pre';
      var postName = 'i18n-' + locale + '-post';
      if (!grunt.task.exists(preName)) {
        grunt.registerTask(preName, 'copied the files over', function() {
          var results = grunt.file.expand(root + '/**/*.' + locale + '.*');
          results.forEach(function (localeFilePath) {
            var defaultFilePath = localeFilePath.replace('.' + locale + '.js', '.js');
            var backupFileName = localeFilePath.replace('.' + locale + '.js', '-old.js');
            grunt.file.copy(defaultFilePath, backupFileName);
            grunt.file.copy(localeFilePath, defaultFilePath);
          });
        });
      }

      if (!grunt.task.exists(postName)) {
        grunt.registerTask(postName, 'copied the files over', function() {
          var results = grunt.file.expand(root + '/**/*-old.*');
          results.forEach(function(backupFilePath) {
            var defaultFilePath = backupFilePath.replace('-old.js', '.js');
            var localeFilePath = defaultFilePath.replace('.js', '.' + locale + '.js');
            grunt.file.copy(defaultFilePath, localeFilePath);
            grunt.file.copy(backupFilePath, defaultFilePath);

            grunt.file.delete(backupFilePath);
          });
        });
      }

      grunt.task.run([preName].concat([task + ':' + locale]).concat([postName]));
    });
  });

};
