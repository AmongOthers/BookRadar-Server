var requestsHandlers = require("./requestHandlers");

function route(pathname, response, request) {
	var handler = requestsHandlers.handlers[pathname];
	if(handler) {
		handler(response, request);
	}
	else {
		console.log("No request handler found for " + pathname);
	    response.writeHead(404, {"Content-Type": "text/plain"});
	    response.write("404 Not found");
	    response.end();
	}
}

exports.route = route;