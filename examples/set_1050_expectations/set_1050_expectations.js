var client = require('mockserver-client').mockServerClient("localhost", 1080);

for (i = 0; i < 1050; i++) {
    (function(counter) {
        client
            .mockAnyResponse(
                {
                    'httpRequest': {
                        'path': '/somePath' + counter
                    },
                    'httpResponse': {
                        'statusCode': 200,
                        'body': JSON.stringify({name: i})
                    }
                }
            )
            .then(
                function () {
                    console.log("created expectation " + counter);
                }, 
                function (error) {
                    console.log(error.body);
                }
            );
    })(i);
}
