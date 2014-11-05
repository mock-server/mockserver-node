/*
 * mockserver
 * http://mock-server.com
 *
 * Copyright (c) 2014 James Bloom
 * Licensed under the Apache License, Version 2.0
 */

(function () {
    "use strict";

    function downloadJar(version) {
        var Q = require('q');
        var deferred = Q.defer();
        var request = require('request');
        var fs = require('fs');
        var glob = require('glob');
        var src = 'https://repo1.maven.org/maven2/org/mock-server/mockserver-netty/' + version + '/mockserver-netty-' + version + '-jar-with-dependencies.jar';
        var dest = 'mockserver-netty-' + version + '-jar-with-dependencies.jar';

        var currentMockServerJars = glob.sync('**/mockserver-netty-*-jar-with-dependencies.jar');
        if (currentMockServerJars.length > 1) {
            console.log('Found duplicate versions of MockServer jar');
            currentMockServerJars.forEach(function (item) {
                fs.unlinkSync(item);
                console.log('Deleted ' + item);
            });
            currentMockServerJars.splice(0);
        }

        if (currentMockServerJars.length === 0) {
            console.log('Fetching ' + src);

            var req = request({
                uri: src
            });

            // On error, callback
            req.on('error', function (error) {
                console.error('Fetching ' + src + ' failed with error ' + error);
                deferred.reject(new Error('Fetching ' + src + ' failed with error ' + error));
            });

            // On response, callback for writing out the stream
            req.on('response', function handleResponse(res) {
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    console.error('Fetching ' + src + ' failed with HTTP status code ' + res.statusCode);
                    deferred.reject(new Error('Fetching ' + src + ' failed with HTTP status code ' + res.statusCode));
                }

                var writeStream = fs.createWriteStream(dest);
                res.pipe(writeStream);

                writeStream.on('error', function (error) {
                    console.error('Saving ' + dest + ' failed with error ' + error);
                    deferred.reject(new Error('Saving ' + dest + ' failed with error ' + error));
                });
                writeStream.on('close', function () {
                    console.log('Saved ' + dest + ' from ' + src);
                    deferred.resolve();
                });
            });
        } else {
            console.log('Skipping ' + src + ' as file already downloaded');
            deferred.resolve();
        }

        return deferred.promise;
    }

    module.exports = {
        downloadJar: downloadJar
    };
})();