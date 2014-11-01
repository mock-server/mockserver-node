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
    var request = require('request');

    function sendRequest(url) {
        var deferred = Q.defer();
        var options = {
            method: 'GET',
            url: url
        };
        request(options, function (error, response) {
            if (error) {
                deferred.reject(new Error(error));
            } else {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    }

    function start_mockserver(options) {
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

        var numberOfRetries = 3500;
        function checkStarted() {
            var promise = sendRequest('http://localhost:' + testPort);
            return promise.then(
                function () {
                    return promise;
                },
                function () {
                    if (numberOfRetries > 0) {
                        numberOfRetries--;
                        return checkStarted();
                    } else {
                        return promise;
                    }
                }
            )
        }

        return checkStarted();
    }

    function stop_mockserver() {
        if (mockServer) {
            mockServer.kill();

            var numberOfRetries = 3500;
            var deferred = Q.defer();
            function checkStopped() {
                var promise = sendRequest('http://localhost:' + testPort);
                return promise.then(
                    function () {
                        if (numberOfRetries > 0) {
                            numberOfRetries--;
                            return checkStarted();
                        } else {
                            deferred.reject(new Error("Failed to stop MockServer"));
                            return deferred.promise;
                        }
                    },
                    function () {
                        deferred.resolve();
                        return deferred.promise;
                    }
                )
            }

            return checkStopped();
        }
    }

    return {
        start_mockserver: start_mockserver,
        stop_mockserver: stop_mockserver
    };
})();
