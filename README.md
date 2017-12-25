# mockserver-node 

> Node module and grunt plugin to start and stop [MockServer](http://mock-server.com/) and [MockServer](http://mock-server.com/) proxy

[![Build status](https://badge.buildkite.com/84d4f1ca00ee6639c1825ea31f0dcd50bd73088571813a219b.svg?style=square&theme=slack)](https://buildkite.com/mockserver/mockserver-node) [![Dependency Status](https://david-dm.org/jamesdbloom/mockserver-node.png)](https://david-dm.org/jamesdbloom/mockserver-node) [![devDependency Status](https://david-dm.org/jamesdbloom/mockserver-node/dev-status.png)](https://david-dm.org/jamesdbloom/mockserver-node#info=devDependencies) [![Code Climate](http://codeclimate.com/github/jamesdbloom/mockserver-node.png)](https://codeclimate.com/github/jamesdbloom/mockserver-node)

[![NPM](https://nodei.co/npm/mockserver-node.png?downloads=true&stars=true)](https://nodei.co/npm/mockserver-node/) 


For chat room: [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jamesdbloom/mockserver?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## Getting Started
This node module can be used to start and stop [MockServer](http://mock-server.com/) and the [MockServer](http://mock-server.com/) proxy as a node module or as a Grunt plugin.  More information about the [MockServer](http://mock-server.com/) can be found at [mock-server.com](http://mock-server.com/). 

You may install this plugin / node module with the following command:

```shell
npm install mockserver-node --save-dev
```

## Node Module

To start or stop the MockServer from any Node.js code you need to import this module using `require('mockserver-node')` as follows:

```js
var mockserver = require('mockserver-node');
```

Then you can use either the `start_mockserver` or `stop_mockserver` functions as follows:

```js
mockserver.start_mockserver({
                serverPort: 1080,
                proxyPort: 1090,
                verbose: true
            });

// do something

mockserver.stop_mockserver({
                serverPort: 1080,
                proxyPort: 1090,
                verbose: true
            });
```

If you are only using the MockServer then only specify the MockServer port as follows:

```js
mockserver.start_mockserver({serverPort: 1080});

// do something

mockserver.stop_mockserver({serverPort: 1080});
```
The MockServer and the MockServer Proxy use port unification to support HTTP and HTTPS on the same port.  A client can then connect to the single port with both HTTP and HTTPS as the socket will automatically detected SSL traffic and decrypt it when required.

## Grunt Plugin

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

In your project's Gruntfile, add a section named `start_mockserver` and `stop_mockserver` to the data object passed into `grunt.initConfig()`.

The following example will result in a both a MockServer and a MockServer Proxy being started on ports `1080` and `1090`.

```js
grunt.initConfig({
    start_mockserver: {
        options: {
            serverPort: 1080,
            proxyPort: 1090
        }
    },
    stop_mockserver: {
        options: {
            serverPort: 1080,
            proxyPort: 1090
        }
    }
});

grunt.loadNpmTasks('mockserver-node');
```

### Options

#### options.serverPort
Type: `Integer`
Default value: `undefined`

This value specifies the HTTP and HTTPS port for the MockServer port unification is used to support HTTP and HTTPS on the same port.  The MockServer will only be started if a port is provided, if this value is left `undefined` the MockServer will not be started.

#### options.proxyPort
Type: `Integer`
Default value: `undefined`

This value specifies the HTTP, HTTPS, SOCKS and HTTP CONNECT port for proxy, port unification is used to support all protocols on the same port.  The proxy will only be started if a port is provided, if this value is left `undefined` the proxy will not be started.

#### options.artifactoryHost
Type: `String` 
Default value: `oss.sonatype.org`

This value specifies the name of the artifact repository host.

#### options.artifactoryPath
Type: `String` 
Default value: `/content/repositories/releases/org/mock-server/mockserver-netty/`

This value specifies the path to the artifactory leading to the mockserver-netty jar with dependencies.

#### options.verbose
Type: `Boolean`
Default value: `false`

This value indicates whether the MockServer logs should be written to the console.  In addition to logging additional output from the grunt task this options also sets the logging level of the MockServer to [**INFO**](http://www.mock-server.com/mock_server/debugging_issues.html). At **INFO** level all interactions with the MockServer including setting up expectations, matching expectations, clearing expectations and verifying requests are written to the log. The MockServer logs are written to ```mockserver.log``` in the current directory.  

**Note:** It is also possible to use the ```--verbose``` command line switch to enabled verbose level logging from the command line.

#### options.trace
Type: `Boolean`
Default value: `false`

This value sets the logging level of the MockServer to [**TRACE**](http://www.mock-server.com/mock_server/debugging_issues.html). At **TRACE** level (in addition to **INFO** level information) all matcher results, including when specific matchers fail (such as HeaderMatcher) are written to the log. The MockServer logs are written to ```mockserver.log``` in the current directory. 

#### options.javaDebugPort
Type: `Integer`
Default value: `undefined`

This value indicates whether Java debugging should be enabled and if so which port the debugger should listen on.  When this options is provided the following additional option is passed to the JVM:
 
```bash
"-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=" + javaDebugPort
```  

Note that `suspend=y` is used so the MockServer will pause until the debugger is attached.  The grunt task will wait 50 seconds for the debugger to be attached before it exits with a failure status.
  
#### options.systemProperties
Type: `String`
Default value: `undefined`

This value allows any system properties to be passed to the JVM that runs MockServer, for example:
 
```js
start_mockserver: {
    options: {
        serverPort: 1080,
        proxyPort: 1090,
        systemProperties: "-Dmockserver.enableCORSForAllResponses=true"
    }
}
```  

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

Date       | Version | Description
:--------- |:------- |:----------------------------------------------------
2014-28-10 | v0.0.1  | Released mockserver-grunt task
2014-28-10 | v0.0.2  | Minor tweaks
2014-28-10 | v0.0.3  | Yet more minor tweaks with build
2014-29-10 | v0.0.4  | Separated out of main MockServer build
2014-29-10 | v0.0.5  | Fully integration new drone.io build
2014-29-10 | v0.0.6  | Fixing issue with attached jar
2014-29-10 | v0.0.7  | Fixing issue missing tasks folder
2014-29-10 | v0.0.8  | Added support for use as plain node module
2014-29-10 | v0.0.9  | Added missing critical file to module
2014-30-10 | v1.0.0  | Fixed final issues with file naming
2014-30-10 | v1.0.1  | Improved the documentation
2014-30-10 | v1.0.2  | Improved the documentation
2014-01-11 | v1.0.3  | Replaced sleep with detection MockServer status
2014-02-11 | v1.0.4  | Upgraded MockServer version and build process
2014-03-11 | v1.0.5  | Fixed important typo in read me
2014-03-11 | v1.0.6  | Fixed missing dependency
2014-05-11 | v1.0.7  | Fixed issue #1 with bower & the jar file
2014-20-11 | v1.0.8  | Upgrading MockServer & glob versions
2014-20-11 | v1.0.9  | Upgrading MockServer to 3.8.1
2014-23-11 | v1.0.10 | Upgrading MockServer to 3.8.2
2014-03-12 | v1.0.11 | Add additional options and improved promise handling
2014-03-12 | v1.0.12 | Improved documentation
2014-04-12 | v1.0.13 | Removed dependency on request module
2014-05-12 | v1.0.14 | Upgrading MockServer to 3.9.1
2015-04-06 | v1.0.15 | Upgrading MockServer to 3.9.3
2015-04-09 | v1.0.16 | Upgrading MockServer to 3.9.6
2015-04-09 | v1.0.17 | Re-publishing as previous failed
2015-04-10 | v1.0.18 | Upgrading MockServer to improve logging
2015-04-10 | v1.0.19 | Improved jar download & logging switches
2015-04-14 | v1.0.20 | Upgraded MockServer to improve SOCKS proxy
2015-04-14 | v1.0.21 | Re-publishing as previous failed
2015-05-01 | v1.0.23 | Upgrading MockServer version and improving stop script
2015-05-05 | v1.0.24 | Trying to fix missing file caused by `npm publish` failing
2015-06-02 | v1.0.25 | Upgrading MockServer to 3.9.15
2015-06-20 | v1.0.26 | Upgrading MockServer to 3.9.16
2015-06-30 | v1.0.27 | Upgrading MockServer to 3.9.17
2015-09-27 | v1.0.28 | Upgrading MockServer to 3.10.0
2015-09-27 | v1.0.29 | Improved the way MockServer is stopped
2015-10-05 | v1.0.30 | Upgrading MockServer to 3.10.1
2016-09-27 | v1.0.31 | Updated dependencies
2016-09-27 | v1.0.32 | Fixed bug #8
2016-10-09 | v1.0.33 | Resolved issues with dependencies
2017-04-26 | v1.0.34 | Updated MockServer to 3.10.5
2017-04-26 | v1.0.35 | Removing jar from module
2017-04-27 | v1.0.36 | Updated MockServer to 3.10.6
2017-04-29 | v1.0.37 | Updated build badge and flexible artifactory
2017-04-30 | v1.0.38 | Added support for generic system properties
2017-05-03 | v1.0.39 | Improving promise logic for protractor
2017-05-04 | v1.0.41 | Validation of configuration and improved errors
2017-07-12 | v1.1.0  | Renamed to mockserver-node
2017-07-12 | v1.1.1  | Fixing peer dependencies
2017-07-12 | v1.1.2  | Adding shutdown hook for Node to JVM
2017-09-21 | v2.0.0  | Upgrading MockServer to 3.11
2017-10-16 | v2.1.0  | Upgrading MockServer to 3.12
2017-12-06 | v5.1.0  | Upgrading MockServer to 5.1.0
2017-12-07 | v5.1.1  | Upgrading MockServer to 5.1.1
2017-12-10 | v5.2.0  | Upgrading MockServer to 5.2.0
2017-12-11 | v5.2.1  | Upgrading MockServer to 5.2.1
2017-12-12 | v5.2.2  | Upgrading MockServer to 5.2.2
2017-12-18 | v5.2.3  | Upgrading MockServer to 5.2.3
2017-12-25 | v5.3.0  | Upgrading MockServer to 5.3.0

---

Task submitted by [James D Bloom](http://blog.jamesdbloom.com)

[![Analytics](https://ga-beacon.appspot.com/UA-32687194-4/mockserver-node/README.md)](https://github.com/igrigorik/ga-beacon)
