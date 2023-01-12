function runMockServer() {
    var mockserver = require('mockserver-node');

    mockserver
        .start_mockserver({
            serverPort: 1080,
            jvmOptions: [
                '-Dmockserver.enableCORSForAllResponses=true',
                '-Dmockserver.corsAllowMethods="CONNECT, DELETE, GET, HEAD, OPTIONS, POST, PUT, PATCH, TRACE"',
                '-Dmockserver.corsAllowHeaders="Allow, Content-Encoding, Content-Length, Content-Type, ETag, Expires, Last-Modified, Location, Server, Vary, Authorization"',
                '-Dmockserver.corsAllowCredentials=true -Dmockserver.corsMaxAgeInSeconds=300'
            ],
            mockServerVersion: "5.15.0",
            verbose: true
        })
        .then(
            function () {
                console.log("started MockServer");
            },
            function (error) {
                console.log(JSON.stringify(error, null, "  "));
            }
        );
}

function createExpectation() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .mockAnyResponse({
            "httpRequest": {
                "method": "GET",
                "path": "/view/cart",
                "queryStringParameters": {
                    "cartId": ["055CA455-1DF7-45BB-8535-4F83E7266092"]
                },
                "cookies": {
                    "session": "4930456C-C718-476F-971F-CB8E047AB349"
                }
            },
            "httpResponse": {
                "body": "some_response_body"
            }
        })
        .then(
            function () {
                console.log("expectation created");
            },
            function (error) {
                console.log(error);
            }
        );
}

function createExpectationOverTLS() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080, undefined, true)
        .mockAnyResponse({
            "httpRequest": {
                "method": "GET",
                "path": "/view/cart",
                "queryStringParameters": {
                    "cartId": ["055CA455-1DF7-45BB-8535-4F83E7266092"]
                },
                "cookies": {
                    "session": "4930456C-C718-476F-971F-CB8E047AB349"
                }
            },
            "httpResponse": {
                "body": "some_response_body"
            }
        })
        .then(
            function () {
                console.log("expectation created");
            },
            function (error) {
                console.log(error);
            }
        );
}

function verifyRequestsExact() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .verify(
            {
                'path': '/some/path'
            }, 2, 2)
        .then(
            function () {
                console.log("request found exactly 2 times");
            },
            function (error) {
                console.log(error);
            }
        );
}

function verifyRequestsReceiveAtLeastTwice() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .verify(
            {
                'path': '/some/path'
            }, 2)
        .then(
            function () {
                console.log("request found exactly 2 times");
            },
            function (error) {
                console.log(error);
            }
        );
}

function verifyRequestsReceiveAtMostTwice() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .verify(
            {
                'path': '/some/path'
            }, 0, 2)
        .then(
            function () {
                console.log("request found exactly 2 times");
            },
            function (error) {
                console.log(error);
            }
        );
}

function verifyRequestsReceiveExactlyTwice() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .verify(
            {
                'path': '/some/path'
            }, 2, 2)
        .then(
            function () {
                console.log("request found exactly 2 times");
            },
            function (error) {
                console.log(error);
            }
        );
}

function verifyRequestsReceiveAtLeastTwiceByOpenAPI() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .verify(
            {
                'specUrlOrPayload': 'https://raw.githubusercontent.com/mock-server/mockserver/master/mockserver-integration-testing/src/main/resources/org/mockserver/openapi/openapi_petstore_example.json'
            }, 2)
        .then(
            function () {
                console.log("request found exactly 2 times");
            },
            function (error) {
                console.log(error);
            }
        );
}

function verifyRequestsReceiveExactlyOnceByOpenAPIWithOperation() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .verify(
            {
                'specUrlOrPayload': 'org/mockserver/openapi/openapi_petstore_example.json',
                'operationId': 'showPetById'
            }, 1, 1)
        .then(
            function () {
                console.log("request found exactly 2 times");
            },
            function (error) {
                console.log(error);
            }
        );
}

function verifyRequestsReceiveExactlyOnceByExpectationIds() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .verifyById(
            {
                'id': '31e4ca35-66c6-4645-afeb-6e66c4ca0559'
            }, 1, 1)
        .then(
            function () {
                console.log("request found exactly 2 times");
            },
            function (error) {
                console.log(error);
            }
        );
}

function verifyRequestSequence() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .verifySequence(
            {
                'path': '/some/path/one'
            },
            {
                'path': '/some/path/two'
            },
            {
                'path': '/some/path/three'
            }
        )
        .then(
            function () {
                console.log("request sequence found in the order specified");
            },
            function (error) {
                console.log(error);
            }
        );
}

function verifyRequestSequenceUsingOpenAPI() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .verifySequence(
            {
                'path': '/status'
            },
            {
                'specUrlOrPayload': 'org/mockserver/openapi/openapi_petstore_example.json',
                'operationId': 'listPets'
            },
            {
                'specUrlOrPayload': 'org/mockserver/openapi/openapi_petstore_example.json',
                'operationId': 'showPetById'
            }
        )
        .then(
            function () {
                console.log("request sequence found in the order specified");
            },
            function (error) {
                console.log(error);
            }
        );
}

function verifyRequestSequenceUsingExpectationIds() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .verifySequenceById(
            {
                'id': '31e4ca35-66c6-4645-afeb-6e66c4ca0559'
            },
            {
                'id': '66c6ca35-ca35-66f5-8feb-5e6ac7ca0559'
            },
            {
                'id': 'ca3531e4-23c8-ff45-88f5-4ca0c7ca0559'
            }
        )
        .then(
            function () {
                console.log("request sequence found in the order specified");
            },
            function (error) {
                console.log(error);
            }
        );
}

function retrieveRecordedRequests() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .retrieveRecordedRequests({
            "path": "/some/path",
            "method": "POST"
        })
        .then(
            function (recordedRequests) {
                console.log(JSON.stringify(recordedRequests, null, "  "));
            },
            function (error) {
                console.log(error);
            }
        );
}

function retrieveRecordedLogMessages() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .retrieveLogMessages({
            "path": "/some/path",
            "method": "POST"
        })
        .then(
            function (logMessages) {
                // logMessages is a String[]
                console.log(logMessages);
            },
            function (error) {
                console.log(error);
            }
        );
}

function clearWithRequestPropertiesMatcher() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .clear({
            'path': '/some/path'
        })
        .then(
            function () {
                console.log("cleared state that matches request matcher");
            },
            function (error) {
                console.log(error);
            }
        );
}

function clearWithOpenAPIRequestMatcher() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .clear({
            "specUrlOrPayload": "https://raw.githubusercontent.com/mock-server/mockserver/master/mockserver-integration-testing/src/main/resources/org/mockserver/openapi/openapi_petstore_example.json",
            "operationId": "showPetById"
        })
        .then(
            function () {
                console.log("cleared state that matches request matcher");
            },
            function (error) {
                console.log(error);
            }
        );
}

function clearWithExpectationId() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .clearById("31e4ca35-66c6-4645-afeb-6e66c4ca0559")
        .then(
            function () {
                console.log("cleared state that matches expectation id");
            },
            function (error) {
                console.log(error);
            }
        );
}

function clearRequestsAndLogsWithRequestPropertiesMatcher() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .clear({
            'path': '/some/path'
        }, 'LOG')
        .then(
            function () {
                console.log("cleared state that matches request matcher");
            },
            function (error) {
                console.log(error);
            }
        );
}

function clearRequestAndLogsWithOpenAPIRequestMatcher() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .clear({
            "specUrlOrPayload": "https://raw.githubusercontent.com/mock-server/mockserver/master/mockserver-integration-testing/src/main/resources/org/mockserver/openapi/openapi_petstore_example.json",
            "operationId": "showPetById"
        }, 'LOG')
        .then(
            function () {
                console.log("cleared state that matches request matcher");
            },
            function (error) {
                console.log(error);
            }
        );
}

function reset() {
    var mockServerClient = require('mockserver-client').mockServerClient;
    mockServerClient("localhost", 1080)
        .reset()
        .then(
            function () {
                console.log("reset all state");
            },
            function (error) {
                console.log(error);
            }
        );
}