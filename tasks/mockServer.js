/*
 * mockserver
 * http://mock-server.com
 *
 * Copyright (c) 2014 James Bloom
 * Licensed under the Apache License, Version 2.0
 */

module.exports = function (grunt) {

    'use strict';

    var mockServer = require('../mockServer.js');

    grunt.registerMultiTask('start_mockserver', 'Run MockServer from grunt build', function () {
        var done = this.async();
        var options = this.options();
        options.verbose = grunt.option('verbose');
        mockServer.start_mockserver(options);
        done(true);
    });

    grunt.registerTask('stop_mockserver', 'Stop MockServer from grunt build', function() {
        var done = this.async();
        mockServer.stop_mockserver();
        done(true);
    });
};
