/*
 * mockserver
 * http://mock-server.com
 *
 * Copyright (c) 2014 James Bloom
 * Licensed under the Apache License, Version 2.0
 */

module.exports = function (grunt) {

    'use strict';

    var mockServer = require('../index.js');

    grunt.registerTask('start_mockserver', 'Run MockServer from grunt build', function () {
        var done = this.async();
        var options = this.options();
        options.verbose = grunt.option('verbose');
        mockServer.start_mockserver(options).then(function() {
            done(true);
        }, function() {
            done(false);
        });
    });

    grunt.registerTask('stop_mockserver', 'Stop MockServer from grunt build', function() {
        var done = this.async();
        var options = this.options();
        options.verbose = grunt.option('verbose');
        mockServer.stop_mockserver(options).then(function() {
            done(true);
        }, function() {
            done(false);
        });
    });
};
