var mockserver = require('mockserver-node');
var mockServerClient = require('mockserver-client').mockServerClient;
var mockserver_port = 1080;

mockserver
    .start_mockserver({serverPort: mockserver_port, verbose: true})
    .then(function () {
        mockServerClient("localhost", 1080).mockAnyResponse(
            {
                'httpRequest': {
                    'path': '/somePath'
                },
                'httpResponse': {
                    'statusCode': 200,
                    'body': JSON.stringify({name: 'value'}),
                    'delay': {
                        'timeUnit': 'MILLISECONDS',
                        'value': 250
                    }
                }
            }
        );
    });