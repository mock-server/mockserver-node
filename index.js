/*
 * mockserver
 * http://mock-server.com
 *
 * Copyright (c) 2014 James Bloom
 * Licensed under the Apache License, Version 2.0
 */

module.exports = (function(){

	var mockServer;

	function start_mockserver(options) {
	        var spawn = require('child_process').spawn;
	        var sleep = require('sleep');
			var glob = require('glob');
	        var commandLineOptions = ['-Dfile.encoding=UTF-8', '-Dmockserver.logLevel=WARN', '-jar', glob.sync('**/mockserver-netty-*-jar-with-dependencies.jar')];
	        if (options.serverPort) {
	            commandLineOptions.push("-serverPort");
	            commandLineOptions.push(options.serverPort);
	        }
	        if (options.serverSecurePort) {
	            commandLineOptions.push("-serverSecurePort");
	            commandLineOptions.push(options.serverSecurePort);
	        }
	        if (options.proxyPort) {
	            commandLineOptions.push("-proxyPort");
	            commandLineOptions.push(options.proxyPort);
	        }
	        if (options.proxySecurePort) {
	            commandLineOptions.push("-proxySecurePort");
	            commandLineOptions.push(options.proxySecurePort);
	        }
	        if (options.verbose) {
	        	console.log('Running \'java ' + commandLineOptions.join(' ') + '\'');
	        }
	        mockServer = spawn('java', commandLineOptions, {
	            stdio: [ 'ignore', (options.verbose ? process.stdout : 'ignore'), process.stderr ]
	        });

	        sleep.sleep(5);
	    };

	function stop_mockserver() {
	        if (mockServer) {
	            mockServer.kill();
	        }
	    };

	return {
	    start_mockserver: start_mockserver,
	    stop_mockserver: stop_mockserver
	};
})();
