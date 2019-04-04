(function () {

    'use strict';

    var testCase = require('nodeunit').testCase;
    var mockserver = require(__dirname + '/../../..');

    exports.mock_server_start_failure = {
        'mock server fails to start': testCase({
            'if configuration missing': function (test) {

                test.expect(1);
                mockserver
                    .start_mockserver()
                    .then(
                        function () {
                            test.ok(false, "should fail to start");
                            test.done();
                        },
                        function (error) {
                            test.equal(error, 'Please specify "serverPort", for example: "start_mockserver({ serverPort: 1080 })"');
                            test.done();
                        }
                    );
            },
            'if port is missing': function (test) {

                test.expect(1);
                mockserver
                    .start_mockserver({})
                    .then(
                        function () {
                            test.ok(false, "should fail to start");
                            test.done();
                        },
                        function (error) {
                            test.equal(error, 'Please specify "serverPort", for example: "start_mockserver({ serverPort: 1080 })"');
                            test.done();
                        }
                    );
            }
        })
    };

    exports.mock_server_stop_failure = {
        'mock server fails to stop': testCase({
            'if configuration missing': function (test) {

                test.expect(1);
                mockserver
                    .stop_mockserver()
                    .then(
                        function () {
                            test.ok(false, "should fail to start");
                            test.done();
                        },
                        function (error) {
                            test.equal(error, 'Please specify "serverPort", for example: "stop_mockserver({ serverPort: 1080 })"');
                            test.done();
                        }
                    );
            },
            'if port is missing': function (test) {

                test.expect(1);
                mockserver
                    .stop_mockserver({})
                    .then(
                        function () {
                            test.ok(false, "should fail to start");
                            test.done();
                        },
                        function (error) {
                            test.equal(error, 'Please specify "serverPort", for example: "stop_mockserver({ serverPort: 1080 })"');
                            test.done();
                        }
                    );
            }
        })
    };

})();
