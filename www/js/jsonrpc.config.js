
// Set JSON-RPC server variables
	/* Note that if the hostname being requested here doesn't match the
	 * hostname where the page originated, it will be subjected to the
	 * Same-Origin Policy, and Cross-Origin Resource Sharing will be
	 * required.  See here for more details:
	 * http://en.wikipedia.org/wiki/Cross-origin_resource_sharing
	 * CORS must be configured on the server side to allow the client's
	 * domain/origin.
	 */

	var jsonrpc_config = {
	// This is either http or https
		// 'method'    : 'https',
		'method'    : 'http',
	// The hostname or IP address of the server we're hitting
		// 'server'    : 'api.commercial.guido.makpc.hyperionclients.com',
		'server'    : 'jsonrpc_otsr_backend.springboard.local',
	// The port on which to establish the connection (usually 80 for http or 443 for https)
		'port'      : '80',
	// The path to the JSON-RPC server, directories must end with a trailing slash
		'path'      : '/',
	// The API key to use when contacting the server
		// 'api_key'   : '23c27685-8ed8-4f09-9a09-16f6cdea79ee',
		'api_key'   : '81df50a9-1d13-4005-b267-3cd176f46eb8',
	// The API password to when contacting the server
		// 'api_pass'  : 'lUhr07ZVT7UMcRGC',
		'api_pass'  : 'qtsY2P8ae1HDienY',
	// The API token from the key and password
		'api_token' : '7cdd4677-c5d9-4a17-ae00-fcf33e9fe90f$6$37dafef39848d713$QiRQpXIJs4Q5lOliVW0MKtidS74tWPk5lSiuI2MrYwoBvLps/vqFzmxc2sPPnWDuy5SIZfmRepF4nEjY29prZ0',

		'appback_files'  : 'http://truebond-appback.local/files/',
	};

	jsonrpc_config.url = jsonrpc_config.method + '://' + jsonrpc_config.server + ':' + jsonrpc_config.port + jsonrpc_config.path;
    // console.log(jsonrpc_config.url);

