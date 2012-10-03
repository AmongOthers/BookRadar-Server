var http = require("http");
var url = require("url");
var route = require("./route");

function start() {
	process.on("uncaughtException", function(err){
		console.log("Server met exception:\n");
		if(err.err) {
			console.log({err: err.e, url: err.url});
			console.log("\n");
			response.writeHeader(500, {"Content-Type": "text/plain"});
			response.write(err.e + "\n");
			response.end();
		}
		else {
			console.log(err);
		}
	});
	http.createServer(function (request, response) {
		var requestStr = request.url;
		var pathname = url.parse(requestStr).pathname;
		route.route(pathname, response, request);
	}).listen(8124);

	console.log("Server running at http://127.0.0.1:8124");
}

exports.start = start;