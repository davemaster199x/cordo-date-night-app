
	var jsonrpc_client = {
	/*
	 * JSON-RPC Client
	 * Takes in methods created by the jsonrpc_method object, encodes
	 * them, sends them to the server, parses and returned the response.
	 */
		methods        : [],
		response       : [],
		response_raw   : '',
		response_array : [],
		server         : '',
		error          : '',
		error_code     : 0,

		generate_unique_id: function() {
		/*
		 * Generate Unique ID
		 * Generates a unique ID for use as an ID for requests sent to
		 * the server.
		 */
			var ids = [];

			do {
				var rand = Math.floor( Math.random() * 1000000000 );
			}
			while( ids.indexOf( rand ) != -1 );

			ids.push( rand );

			return rand;
		},

		method: function( method ) {
		/*
		 * Method
		 * Add a method from the jsonrpc_method class.
		 */
			this.methods.push( method );
		},

		parse_json_response: function( jsonrpc_resp ) {
		/*
		 * Parse JSON Response
		 * Parses through the JSON-RPC server's response and breaks out the
		 * "response", "message", and "data" parts into an associative
		 * array labeled with the request id.
		 */
			var jsonrpc_type = '';

			if ( typeof jsonrpc_resp.jsonrpc !== 'undefined' ) {
				// Single response, convert to 1 item array.
				jsonrpc_resp = [ jsonrpc_resp ];
			}

			if ( typeof jsonrpc_resp !== 'undefined' && $.isArray( jsonrpc_resp )) {
				var response = {};

				for ( key in jsonrpc_resp ) {
					if ( typeof jsonrpc_resp[ key ]['result'] !== 'undefined' ) {
						var resp_type = 'result';
					} else {
						var resp_type = 'error';
					}

					if ( typeof response[ jsonrpc_resp[ key ][ resp_type ] ] === 'undefined' ) {
						response[ jsonrpc_resp[ key ].id ] = {
							response : '',
							message  : '',
							data     : ''
						};
					}

					if ( typeof jsonrpc_resp[ key ][ resp_type ].response !== 'undefined' ) {
						response[ jsonrpc_resp[ key ].id ].response = jsonrpc_resp[ key ][ resp_type ]['response'];
					} else {
						response[ jsonrpc_resp[ key ].id ].response = '';
					}

					if ( typeof jsonrpc_resp[ key ][ resp_type ].message !== 'undefined' ) {
						response[ jsonrpc_resp[ key ].id ].message = jsonrpc_resp[ key ][ resp_type ]['message'];
					} else {
						response[ jsonrpc_item[ key ].id ].message = '';
					}

					if ( typeof jsonrpc_resp[ key ][ resp_type ].data !== 'undefined' ) {
						response[ jsonrpc_resp[ key ].id ].data = jsonrpc_resp[ key ][ resp_type ]['data'];
					} else {
						response[ jsonrpc_resp[ key ].id ].data = '';
					}
		        }
			} else {
				response = 'Unrecognizable response from server.';
			}

			return response;
		},

		send: function( params ) {
		/*
		 * Send
		 * Sends the request to the server and parses the response.
		 */
			params.save_methods = typeof params.save_methods !== 'undefined' ? params.save_methods : false;

			if ( this.methods.length == 0 ) {
			// No methods were added, exit
				return;
			} else if ( this.methods.length == 1 ) {
			// One method was added, send as stand-alone
				var rpc = {
					jsonrpc : '2.0',
					method  : this.methods[0].method,
					params  : this.methods[0].params
				};

				if ( typeof this.methods[0].id !== 'undefined' ) {
					rpc.id = this.methods[0].id;
				}
			} else {
			// Multiple methods were added, send as batch
				var i   = 0;
				var rpc = [];

				for ( key in this.methods ) {
					rpc[ i ] = {
						jsonrpc : '2.0',
						method  : this.methods[ key ].method,
						params  : this.methods[ key ].params
					};

					if ( typeof this.methods[ key ].id !== 'undefined' ) {
						rpc[ i ].id = this.methods[ key ].id;
					}

					++i;
				}
			}

		// Clear all responses and errors
			this.response     = [];
			this.response_raw = '';
			this.error        = '';
			this.error_code   = 0;

		// Make 'this' available inside the ajax callback functions
			var parent_this = this;
			$.ajax( {
				url      : this.server,
				type     : 'POST',
				data     : JSON.stringify( rpc ),
				dataType : 'text'
			} )
			.done( function( data, status, jqXHR ) {
			// The call was successful
				parent_this.response_raw = data;
				parent_this.response     = $.parseJSON( data );

				if ( params.save_methods != true ) {
					parent_this.methods = [];
				}

				params.success();
			} )
			.fail( function( jqXHR, status, error ) {
			// The call failed
				parent_this.error      = status;
				parent_this.error_code = error;

				params.error();
			} );
		},

		server: function( url ) {
		/*
		 * Server
		 * Set the server URL
		 */
			this.server = url;
		}
	}

	var jsonrpc_method = {
	/*
	 * JSON-RPC Method
	 * Creates an object for the method and collects parameters to send
	 * to the server.
	 */
		id     : '',
		method : '',
		params : {},

		id_set: function( id ) {
		/*
		 * ID
		 * Specify the unique ID
		 */
			this.id = id;
		},

		method_set: function( method ) {
		/*
		 * Method
		 * Specifies the method we're calling
		 */
			this.method = method;
		},

		param_set: function( name, value = null ) {
		/*
		 * Param
		 * Add a parameter to this call
		 */
			if ( $.isArray( name )) {
				for( field in name ) {
					this.params[ field ] = name[ field ];
				}
			} else {
				this.params[ name ] = value;
			}
		}
	}

