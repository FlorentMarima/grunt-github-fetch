/*
 * grunt-github-fetch
 * https://github.com/FlorentMarima/grunt-github-fetch
 *
 * Copyright (c) 2014 Florent Marima
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    github_fetch: {
	      example1 : {
		  // tokenFile is required for private repositories
		  tokenFile : 'token.json',
		  repository : 'repository',
		  owner : 'github_pseudo',
		  tag : 'v1.0',
		  filename : 'script.js',
		  output : 'prod/script.js'
	      },
	      
	      example2 : {
		  repository: 'public_repo',
		  owner : 'github_pseudo2',
		  tag : 'v1.0',
		  filename: 'out.tar.gz',
		  // output will be ./:filename
	      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
