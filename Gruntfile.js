/*
 * mockserver
 * http://mock-server.com
 *
 * Copyright (c) 2014 James Bloom
 * Licensed under the Apache License, Version 2.0
 */

'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        exec: {
            stop_existing_mockservers: './stop_MockServer.sh'
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.started %>',
                '<%= nodeunit.stopped %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        start_mockserver: {
            start: {
                options: {
                    serverPort: 1080,
                    proxyPort: 1090
                }
            }
        },
        stop_mockserver: {
            stop: {

            }
        },
        nodeunit: {
            started: [
                'test/started/*_test.js'
            ],
            stopped: [
                'test/stopped/*_test.js'
            ],
            options: {
                reporter: 'nested'
            }
        }
    });

    grunt.registerTask('download_jar', 'Download latest MockServer jar version', function () {
        var done = this.async();
        require('./downloadJar').downloadJar('3.10.1').then(function () {
            done(true);
        }, function () {
            done(false);
        });
    });

    grunt.registerTask('deleted_jars', 'Delete any old MockServer jars', function() {
        var fs = require('fs');
        var currentMockServerJars = require('glob').sync('**/mockserver-netty-*-jar-with-dependencies.jar');        
        currentMockServerJars.forEach(function (item) {
            fs.unlinkSync(item);
            console.log('Deleted ' + item);
        });
        currentMockServerJars.splice(0);
    });

    // load this plugin's task
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['start_mockserver:start', 'nodeunit:started', 'stop_mockserver:stop', 'nodeunit:stopped']);

    grunt.registerTask('wrecker', ['deleted_jars', 'download_jar', 'jshint', 'test']);
    grunt.registerTask('default', ['exec', 'wrecker']);
};
