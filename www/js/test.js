function test(){
    console.log('Cordova is ready');

    var jsonrpc_config = {
        method: 'http',
        server: 'jsonrpc_otsr_backend.springboard.local',
        port: '80',
        path: '/',
        api_token: '7cdd4677-c5d9-4a17-ae00-fcf33e9fe90f$6$37dafef39848d713$QiRQpXIJs4Q5lOliVW0MKtidS74tWPk5lSiuI2MrYwoBvLps/vqFzmxc2sPPnWDuy5SIZfmRepF4nEjY29prZ0'
    };

    jsonrpc_config.url = jsonrpc_config.method + '://' + jsonrpc_config.server + ':' + jsonrpc_config.port + jsonrpc_config.path;

    var rpcPayload = {
        jsonrpc: '2.0',
        method: 'user.login',
        params: {
            api_token: jsonrpc_config.api_token
        },
        id: Math.floor(Math.random() * 1000000000)  // Generate unique ID
    };

    // Use cordova-plugin-advanced-http to make the POST request
    cordova.plugin.http.setDataSerializer('json');  // Set the data serializer to 'json'

    cordova.plugin.http.post(jsonrpc_config.url, rpcPayload, { 'Content-Type': 'application/json' }, function(response) {
        // Success handler
        var jsonResponse = JSON.parse(response.data);  // Parse the JSON-RPC response
        console.log('Success:', jsonResponse);
        // Handle the response as per your logic
        if (jsonResponse.result && jsonResponse.result.response == 'complete') {
            console.log('Login successful');
        } else {
            console.log('Something went wrong:', jsonResponse.result.message);
        }
    }, function(error) {
        // Error handler
        console.error('Error:', error);
    });
}

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-');
    // test();
    // document.getElementById('deviceready').classList.add('ready');
}