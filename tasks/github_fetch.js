/*
 * grunt-github-fetch
 * https://github.com/FlorentMarima/grunt-gh-fetch
 *
 * Copyright (c) 2014 Florent Marima
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec;
var chalk = require('chalk');

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('github_fetch', 'Easily fetch github releases assets', function() {

        var OK = function(msg) {
            process.stdout.write(chalk.green(msg));
        };
        var KO = function(msg) {
            process.stderr.write(chalk.red(msg));
        };

        var tmp = "." + Date.now() + ".grunt-gh-fetch.tmp";
        var cb = this.async();


        var executeCommand = function(command, callback) {
            var cmd = grunt.template.process(command);
            var cp = exec(cmd, options.execOptions, function(err, stdout, stderr) {
                if (callback && !err)
                    callback();
            }.bind(this));
        };

        var getAssetID = function(data, tag, filename) {
            if (typeof(data.length) === 'undefined') {
                KO("Github API request probably failed\n" + JSON.stringify(data) + "\n");
                return undefined;
            }
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].tag_name == tag) {
                    for (var x = 0, y = data[i].assets.length; x < y; x++) {
                        if (data[i].assets[x].name == filename)
                            return data[i].assets[x].id;
                    }
                    KO("Unable to find " + filename + " in tagged " + tag + " release\n");
                }
            }
            KO("Unable to find release tagged " + tag + "\n");
            KO("size == " + data.length);
            return undefined;
        };


        var options = this.options();
        if (typeof(options.repository) === 'undefined' || typeof(options.owner) === 'undefined' || typeof(options.tag) === 'undefined' || typeof(options.filename) === 'undefined') {
            KO(this.nameArgs + ": Missing one or more required field : repository | owner | tag | filename\n");
            return false;
        }

        var tokenFile = typeof(options.tokenFile) !== 'undefined' ? options.tokenFile : undefined;
        var output = typeof(options.output) !== 'undefined' ? options.output : options.filename;


        var token = undefined;
        if (typeof(tokenFile) !== 'undefined') {
            var fileData = grunt.file.readJSON(tokenFile);
            token = fileData.token || undefined;
        }

        var getReleasesDataCommand = "";
        getReleasesDataCommand += "curl -L https://api.github.com/repos/";
        getReleasesDataCommand += options.owner + "/" + options.repository;
        getReleasesDataCommand += "/releases" + (token ? ("?access_token=" + token) : '');
        getReleasesDataCommand += " > " + tmp;

        var removeTmpCommand = "rm -f " + tmp;

        var id = undefined;
        executeCommand(getReleasesDataCommand, function() {
            var data = grunt.file.readJSON(tmp);
            id = getAssetID(data, options.tag, options.filename);
            if (!id) {
                executeCommand(removeTmpCommand);
                cb(false);
                return false;
            }
            executeCommand(removeTmpCommand);

            var fetchAssetCommand = "";
            fetchAssetCommand += "curl -H 'Accept: application/octet-stream' -L https://api.github.com/repos/";
            fetchAssetCommand += options.owner + "/" + options.repository;
            fetchAssetCommand += "/releases/assets/" + id;
            fetchAssetCommand += (token ? ("?access_token=" + token) : '');
            fetchAssetCommand += " > " + output;
            executeCommand(fetchAssetCommand, function() {
                cb();
            });
            OK("Successfully fetched http://github.com/" + options.owner + "/" + options.repository 
                + "/releases/tag/" + options.tag + "/" + options.filename + ". File is ");
            process.stdout.write(chalk.cyan(output + "\n"));
            return true;
        });

    });

};