/*
 * mockserver
 * http://mock-server.com
 *
 * Copyright (c) 2014 James Bloom
 * Licensed under the Apache License, Version 2.0
 */

module.exports = (function () {

    var mockServer;
    var port;

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

    function sendRequest(request) {
        var deferred = Q.defer();

        var callback = function (response) {
            var body = '';

            if (response.statusCode === 400 || response.statusCode === 404) {
                deferred.reject(response.statusCode);
            }

            response.on('data', function (chunk) {
                body += chunk;
            });

            response.on('end', function () {
                deferred.resolve({
                    statusCode: response.statusCode,
                    headers: response.headers,
                    body: body
                });
            });
        };

        var req = http.request(request, callback);
        req.end();

        return deferred.promise;
    }

    function start_mockserver(options) {
        var deferred = Q.defer();

        if (!options) {
            deferred.reject(new Error("options is falsy, it must be defined to specify the port(s) required to start the MockServer"))
        }

        var startupRetries = 100; // wait for 10 seconds

        // double check the jar has already been downloaded
        require('./downloadJar').downloadJar('3.10.4').then(function () {

            var spawn = require('child_process').spawn;
            var glob = require('glob');
            var commandLineOptions = ['-Dfile.encoding=UTF-8'];
            if (options.trace) {
                commandLineOptions.push('-Dmockserver.logLevel=TRACE');
            } else if (options.verbose) {
                commandLineOptions.push('-Dmockserver.logLevel=INFO');
            } else {
                commandLineOptions.push('-Dmockserver.logLevel=WARN');
            }
            if (options.javaDebugPort) {
                commandLineOptions.push('-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=' + options.javaDebugPort);
                startupRetries = 500;
            }
            commandLineOptions.push('-jar');
            commandLineOptions.push(glob.sync('**/mockserver-netty-*-jar-with-dependencies.jar'));
            if (options.serverPort) {
                commandLineOptions.push("-serverPort");
                commandLineOptions.push(options.serverPort);
                port = port || options.serverPort;
            }
            if (options.proxyPort) {
                commandLineOptions.push("-proxyPort");
                commandLineOptions.push(options.proxyPort);
                port = port || options.proxyPort;
            }
            if (options.proxyRemotePort) {
                commandLineOptions.push("-proxyRemotePort");
                commandLineOptions.push(options.proxyRemotePort);
            }
            if (options.proxyRemoteHost) {
                commandLineOptions.push("-proxyRemoteHost");
                commandLineOptions.push(options.proxyRemoteHost);
            }
            if (options.verbose) {
                console.log('Running \'java ' + commandLineOptions.join(' ') + '\'');
            }
            mockServer = spawn('java', commandLineOptions, {
                stdio: ['ignore', (options.verbose ? process.stdout : 'ignore'), process.stderr]
            });

        }).then(function () {
            return checkStarted({
                method: 'PUT',
                host: "localhost",
                path: "/reset",
                port: port
            }, startupRetries, deferred, options.verbose);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function stop_mockserver(options) {
        var deferred = Q.defer();
        if (options.serverPort) {
            port = port || options.serverPort;
        }
        if (options.proxyPort) {
            port = port  || options.proxyPort;
        }
        if (options.verbose) {
            console.log('Using port \'' + port + '\' to stop MockServer and MockServer Proxy');
        }
        sendRequest({
            method: 'PUT',
            host: "localhost",
            path: "/stop",
            port: port
        }).then(function () {
            mockServer && mockServer.kill();
            checkStopped({
                method: 'PUT',
                host: "localhost",
                path: "/reset",
                port: port
            }, 100, deferred, options && options.verbose); // wait for 10 seconds
        });
        return deferred.promise;
    }

    return {
        start_mockserver: start_mockserver,
        stop_mockserver: stop_mockserver
    };
})();
