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
        require('./downloadJar').downloadJar('3.9.3').then(function () {
            done(true);
        }, function () {
            done(false);
        });
    });

    // load this plugin's task
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['start_mockserver:start', 'nodeunit:started', 'stop_mockserver:stop', 'nodeunit:stopped']);

    grunt.registerTask('wrecker', ['download_jar', 'jshint', 'test']);
    grunt.registerTask('default', ['exec', 'wrecker']);
};
