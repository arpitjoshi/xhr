// Try Cath to Handle Ajax Exceptions
var Try = {
        these: function() {
                var returnValue;

                for (var i = 0, length = arguments.length; i < length; i++) {
                        var lambda = arguments[i];
                        try {
                                returnValue = lambda();
                                break;
                        } catch (e) { }
                }

                return returnValue;
        }
};

// Ajax Object handling all errors and request method
var Ajax = {

        getTransport: function() {
                return Try.these(
                        function() {return new XMLHttpRequest();},
                        function() {return new ActiveXObject('Msxml2.XMLHTTP');},
                        function() {return new ActiveXObject('Msxml3.XMLHTTP');},
                        function() {return new ActiveXObject('Microsoft.XMLHTTP');}
                ) || false;
        },

        request: function(url, options, payloadObject) {
                var transport = this.getTransport();
                if (!transport) return;

                if (null !== options && 'function' == typeof(options))
                {
                        options.onSuccess = options;
                }
                else if (!options.onSuccess) {
                        return false;
                }

                if(payloadObject){
                        var postData = '' ;
                        var tmp = new Array();
                        for(key in payloadObject){
                                tmp.push(key+'='+encodeURIComponent(payloadObject[key]));
                        }
                        postData = tmp.join("&") ;
                }

                var method = ((postData) ? "post" : ((options.method) ? options.method : "get"));

                transport.open(method, url, false);
                transport.setRequestHeader('X-REQUESTED-WITH', 'XMLHttpRequest');

                if (options.headers) {
                        for (header in options.headers) {
                                transport.setRequestHeader('X-'+header, options.headers[header]);
                        }
                }

                if (method == 'post') {
                        transport.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                }

                transport.onreadystatechange = function () {
                        if (transport.readyState != 4) return;
                        if (transport.status != 200 && transport.status != 304) {
                                if (options.onFailure) {
                                        options.onFailure(transport.status, transport.responseText);
                                }
                                return;
                        }

                        options.onSuccess(transport.responseText);
                };

                if (transport.readyState == 4) return;
                transport.send(postData);

                return true;
        }
};

// POST data
var postdata = {"a":1, "b":2, "c":3} ;

// Callbacks
var callbackoptions = {
	onSuccess: function(response) {
		console.log(response);
        },
        onFailure: function(code, message) {
		console.log(code);
		console.log(message);
        }
};

// Requesting a file using AJAX 
Ajax.request('http://example.com/abc', callbackoptions, postdata);



