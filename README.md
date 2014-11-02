# mockserver-grunt 

> Node module and grunt plugin to start and stop [MockServer](http://mock-server.com/)

Grunt plugin to MockServer and the MockServer proxy to started and stopped from grunt.

[![Build Status](https://drone.io/github.com/jamesdbloom/mockserver-grunt/status.png)](https://drone.io/github.com/jamesdbloom/mockserver-grunt/latest) [![Dependency Status](https://david-dm.org/jamesdbloom/mockserver-grunt.png)](https://david-dm.org/jamesdbloom/mockserver-grunt) [![devDependency Status](https://david-dm.org/jamesdbloom/mockserver-grunt/dev-status.png)](https://david-dm.org/jamesdbloom/mockserver-grunt#info=devDependencies)
[![Still Maintained](http://stillmaintained.com/jamesdbloom/mockserver.png)](http://stillmaintained.com/jamesdbloom/mockserver) 


[![Stories in Backlog](https://badge.waffle.io/jamesdbloom/mockserver.png?label=proposal&title=Proposals)](https://waffle.io/jamesdbloom/mockserver) [![Stories in Backlog](https://badge.waffle.io/jamesdbloom/mockserver.png?label=ready&title=Ready)](https://waffle.io/jamesdbloom/mockserver) [![Stories in Backlog](https://badge.waffle.io/jamesdbloom/mockserver.png?label=in%20progress&title=In%20Progress)](https://waffle.io/jamesdbloom/mockserver)


[![NPM](https://nodei.co/npm/mockserver-grunt.png?downloads=true&stars=true)](https://nodei.co/npm/mockserver-grunt/)

## Getting Started
This node module can be used to start and stop [MockServer](http://mock-server.com/) and the [MockServer](http://mock-server.com/) proxy as a node module or as a Grunt plugin.

You may install this plugin / node module with the following command:

```shell
npm install mockserver-grunt --save-dev
```

## Node Module

To start or stop the MockServer from any node.js code you need to import this module using `require('mockserver-grunt')` as follows:

```js
var mockserver = require('mockserver-grunt');
```

Then you can use either the `start_mockserver` or `stop_mockserver` functions as follows:

```js
mockserver.start_mockserver({
                serverPort: 1080,
                serverSecurePort: 1082,
                proxyPort: 1090,
                proxySecurePort: 1092,
                verbose: true
            });

// do something

mockserver.start_mockserver();
```

## Grunt Plugin

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

In your project's Gruntfile, add a section named `start_mockserver` and `stop_mockserver` to the data object passed into `grunt.initConfig()`.

The following example will result in a both a MockServer and a MockServer Proxy being started on both HTTP and HTTPS ports. 

```js
grunt.initConfig({
    start_mockserver: {
        start: {
            options: {
                serverPort: 1080,
                serverSecurePort: 1082,
                proxyPort: 1090,
                proxySecurePort: 1092
            }
        }
    },
    stop_mockserver: {
        stop: {
    
        }
    }
});

grunt.loadNpmTasks('mockserver-grunt');
```

To control what is started only specify the ports you require. For example if you only want to start the MockServer for HTTP only provide this port, if you do this the proxy will not be started and the MockServer will not create an HTTPS endpoint. 

### Options

#### options.serverPort
Type: `Integer`
Default value: `undefined`

This value indicates that you want to start the MockServer using this value for the HTTP port.  The MockServer will only be started if either an HTTP i.e. `serverPort` or HTTPS i.e. `serverSecurePort` port is provided, if neither are provided the MockServer will not be started.

#### options.serverSecurePort
Type: `Integer`
Default value: `undefined`

This value indicates that you want to start the MockServer using this value for the HTTPS port.  The MockServer will only be started if either an HTTP i.e. `serverPort` or HTTPS i.e. `serverSecurePort` port is provided, if neither are provided the MockServer will not be started.

#### options.proxyPort
Type: `Integer`
Default value: `undefined`

This value indicates that you want to start the proxy using this value for the HTTP port.  The proxy will only be started if either an HTTP i.e. `proxyPort` or HTTPS i.e. `proxySecurePort` port is provided, if neither are provided the proxy will not be started.

#### options.proxySecurePort
Type: `Integer`
Default value: `undefined`

This value indicates that you want to start the proxy using this value for the HTTPS port.  The proxy will only be started if either an HTTP i.e. `proxyPort` or HTTPS i.e. `proxySecurePort` port is provided, if neither are provided the proxy will not be started.

#### options.verbose
Type: `Boolean`
Default value: `false`

This value indicates whether the MockServer logs should be written to the console.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2014-28-10   v0.0.1   Released mockserver-grunt task
 * 2014-28-10   v0.0.2   Minor tweaks
 * 2014-28-10   v0.0.3   Yet more minor tweaks with build
 * 2014-29-10   v0.0.4   Separated out of main MockServer build
 * 2014-29-10   v0.0.5   Fully integration new drone.io build
 * 2014-29-10   v0.0.6   Fixing issue with attached jar
 * 2014-29-10   v0.0.7   Fixing issue missing tasks folder
 * 2014-29-10   v0.0.8   Added support for use as plain node module
 * 2014-29-10   v0.0.9   Added missing critical file to module
 * 2014-30-10   v1.0.0   Fixed final issues with file naming
 * 2014-30-10   v1.0.1   Improved the documentation
 * 2014-30-10   v1.0.2   Improved the documentation
 * 2014-01-11   v1.0.3   Replaced sleep with detection MockServer status

---

Task submitted by [James D Bloom](http://blog.jamesdbloom.com)