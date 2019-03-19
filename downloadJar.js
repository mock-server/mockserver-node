/*
 * mockserver
 * http://mock-server.com
 *
 * Copyright (c) 2014 James Bloom
 * Licensed under the Apache License, Version 2.0
 */

(function () {
    "use strict";

    function downloadJar(version, artifactoryHost, artifactoryPath) {
        var Q = require('q');
        var deferred = Q.defer();
        var https = require('follow-redirects').https;
        var fs = require('fs');
        var glob = require('glob');
        var dest = 'mockserver-netty-' + version + '-jar-with-dependencies.jar';
        var options = {
            host: artifactoryHost,
            path: artifactoryPath + version + "/mockserver-netty-" + version + "-jar-with-dependencies.jar",
            port: 443
        };

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
            console.log('Fetching ' + JSON.stringify(options));
            var req = https.request(options);

            req.once('error', function (error) {
                console.error('Fetching ' + JSON.stringify(options) + ' failed with error ' + error);
                deferred.reject(new Error('Fetching ' + JSON.stringify(options) + ' failed with error ' + error));
            });

            req.once('response', function (res) {
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    console.error('Fetching ' + JSON.stringify(options) + ' failed with HTTP status code ' + res.statusCode);
                    deferred.reject(new Error('Fetching ' + JSON.stringify(options) + ' failed with HTTP status code ' + res.statusCode));
                }

                var writeStream = fs.createWriteStream(dest);
                res.pipe(writeStream);

                writeStream.on('error', function (error) {
                    console.error('Saving ' + dest + ' failed with error ' + error);
                    deferred.reject(new Error('Saving ' + dest + ' failed with error ' + error));
                });
                writeStream.on('close', function () {
                    console.log('Saved ' + dest + ' from ' + JSON.stringify(options));
                    deferred.resolve();
                });
            });

            req.end();
        } else {
            console.log('Skipping ' + JSON.stringify(options) + ' as file already downloaded');
            deferred.resolve();
        }

        return deferred.promise;
    }

    module.exports = {
        downloadJar: downloadJar
    };
})();
