/*
 * mockserver
 * http://mock-server.com
 *
 * Copyright (c) 2014 James Bloom
 * Licensed under the Apache License, Version 2.0
 */

module.exports = (function () {

    var mockServer;
    var testPort;

    var Q = require('q');
    var http = require('http');

    function checkStarted(request, retries, promise, verbose) {
        var deferred = promise || Q.defer();

        var req = http.request(request);

        req.once('response', function (response) {
            var body = '';

            response.on('data', function (chunk) {
                body += chunk;
            });

            response.on('end', function () {
                deferred.resolve({
                    statusCode: response.statusCode,
                    body: body
                });
            });
        });

        req.once('error', function (error) {
            if (retries > 0) {
                setTimeout(function () {
                    verbose && console.log("waiting for MockServer to start retries remaining: " + retries);
                    checkStarted(request, retries - 1, promise, verbose);
                }, 100);
            } else {
                verbose && console.log("MockServer failed to start");
                deferred.reject(error);
            }
        });

        req.end();

        return deferred.promise;
    }

    function checkStopped(request, retries, promise, verbose) {
        var deferred = promise || Q.defer();

        var req = http.request(request);

        req.once('response', function (response) {
            var body = '';

            response.on('data', function (chunk) {
                body += chunk;
            });

            response.on('end', function () {
                if (retries > 0) {
                    verbose && console.log("waiting for MockServer to stop retries remaining: " + retries);
                    setTimeout(function () {
                        checkStopped(request, retries - 1, promise, verbose)
                    }, 100);
                } else {
                    verbose && console.log("MockServer failed to stop");
                    deferred.reject();
                }
            });
        });

        req.once('error', function () {
            deferred.resolve();
        });

        req.end();

        return deferred.promise;
    }

    function start_mockserver(options) {
        var deferred = Q.defer();

        if (!options) {
            deferred.reject(new Error("options is falsy, it must be defined to specify the port(s) required to start the MockServer"))
        }

        // double check the jar has already been downloaded
        require('./downloadJar').downloadJar('3.8.2').then(function () {

            var spawn = require('child_process').spawn;
            var glob = require('glob');
            var commandLineOptions = ['-Dfile.encoding=UTF-8', '-Dmockserver.logLevel=WARN', '-jar', glob.sync('**/mockserver-netty-*-jar-with-dependencies.jar')];
            if (options.serverPort) {
                commandLineOptions.push("-serverPort");
                commandLineOptions.push(options.serverPort);
                testPort = testPort || options.serverPort;
            }
            if (options.serverSecurePort) {
                commandLineOptions.push("-serverSecurePort");
                commandLineOptions.push(options.serverSecurePort);
                testPort = testPort || options.serverSecurePort;
            }
            if (options.proxyPort) {
                commandLineOptions.push("-proxyPort");
                commandLineOptions.push(options.proxyPort);
                testPort = testPort || options.proxyPort;
            }
            if (options.proxySecurePort) {
                commandLineOptions.push("-proxySecurePort");
                commandLineOptions.push(options.proxySecurePort);
                testPort = testPort || options.proxySecurePort;
            }
            if (options.verbose) {
                console.log('Running \'java ' + commandLineOptions.join(' ') + '\'');
            }
            mockServer = spawn('java', commandLineOptions, {
                stdio: [ 'ignore', (options.verbose ? process.stdout : 'ignore'), process.stderr ]
            });

        }).then(function () {
            return checkStarted({
                method: 'PUT',
                host: "localhost",
                path: "/reset",
                port: testPort
            }, 100, deferred, options.verbose); // up to 10 second delay
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function stop_mockserver(options) {
        if (!mockServer || mockServer.kill()) {
            var deferred = Q.defer();
            checkStopped({
                method: 'PUT',
                host: "localhost",
                path: "/reset",
                port: testPort
            }, 100, deferred, options && options.verbose); // up to 10 second delay
            return deferred.promise;
        }
    }

    return {
        start_mockserver: start_mockserver,
        stop_mockserver: stop_mockserver
    };
})();
