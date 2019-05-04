(function () {

    'use strict';

    var testCase = require('nodeunit').testCase;
    var mockserver = require(__dirname + '/../../..');
    var sendRequest = require(__dirname + '/../../sendRequest.js');

    exports.mock_server_started = {
        'mock server should have started': testCase({
            'should allow expectation to be set up': function (test) {
                var port = 1081;

                test.expect(2);
                mockserver
                    .start_mockserver({serverPort: port})
                    .then(
                        function () {
                            sendRequest("PUT", "localhost", port, "/expectation", {
                                'httpRequest': {
                                    'path': '/somePath'
                                },
                                'httpResponse': {
                                    'statusCode': 202,
                                    'body': JSON.stringify({name: 'first_body'})
                                }
                            })
                                .then(
                                    function (response) {
                                        test.equal(response.statusCode, 201, "allows expectation to be setup");
                                    },
                                    function () {
                                        test.ok(false, "failed to setup expectation");
                                    })
                                .then(function () {
                                    sendRequest("GET", "localhost", port, "/somePath")
                                        .then(
                                            function (response) {
                                                test.equal(response.statusCode, 202, "expectation matched sucessfully");
                                            },
                                            function () {
                                                test.ok(false, "failed to match expectation");
                                            })
                                        .then(function () {
                                            test.done();
                                        });
                                });
                        },
                        function (error) {
                            test.ok(false, "should start without error: \"" + error + "\"");
                            test.done();
                        }
                    );
            }
        })
    };

})();
