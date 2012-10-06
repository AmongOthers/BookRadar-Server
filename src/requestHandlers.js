var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var url = require("url");
var http = require("http");
var library = require("./libraryEngine/gdut");
var Xml2JSON = require("./lib/Xml2JSON");
var searchEngine = require("./searchEngine/searchEngine");
var BookRadarQuery = require("./BookRadarQuery");

function searchLibrary(response, request) {
	var query = url.parse(request.url).query;
	if(query) {
		var keyword = querystring.parse(query).keyword;
		if(keyword) {
			console.log("search for: " + keyword + " begin: " + new Date());
			library.searchByKeyword(keyword, function(err, books) {
				console.log("search for: " + keyword + " end: " + new Date());
				if(!err) {
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.write(JSON.stringify(books));
					response.end();
				}
				else {
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(err.toString());
					response.end();
				}
			});
			return;
		}
	}
	_doWithBadRequest(response, request);
}

function searchDouban(response, request) {
	var query = url.parse(request.url).query;
	if(query) {
		var keyword = querystring.parse(query).keyword;
		if(keyword) {
			doubanBook.searchByKeyword(keyword, function(err, books) {
				if(!err) {
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.write(JSON.stringify(books));
					response.end();
				}
				else {
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(err.toString());
					response.end();
				}
			});
			return;
		}
	}
	_doWithBadRequest(response, request);
}

function search(response, request) {
	var query = url.parse(request.url).query;
	if(query) {
		var keyword = querystring.parse(query).keyword;
		if(keyword) {
			console.log("search for: " + keyword + " begin: " + new Date());
			searchEngine.search(keyword, function(err, books) {
				console.log("search for: " + keyword + " end: " + new Date());
				if(!err) {
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.write(JSON.stringify(books));
					response.end();
				}
				else {
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(err.toString());
					response.end();
				}
			});
			return;
		}
	}
	_doWithBadRequest(response, request);
}

function proxy(response, request) {
	var target = url.parse(request.url).query;
	responseBackTargetUrl(target, response);
}

function responseBackTargetUrl(target, response) {
	http.get(target, function(res){
		res.on("data", function(chunk){
			response.write(chunk);
		}).on("end", function(){
			response.end();
		});
	}).on("error", function(e){
		response.write(e.toString());
		response.end();
	});
}

function start(response, request) {
	var startPage = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(startPage);
	response.end();
	response.end("start\n");
}

function upload(response, request) {
	var form = new formidable.IncomingForm();
	form.parse(request, function(error, fields, files) {
		console.log("error:" + error);
		console.log("fields:" + fields);
		console.log("files:" + files);
		fs.renameSync(files.upload.path, "./tmp/test.png");
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("<img src='/show' />");
		response.end();
	});
}

function list(response, request) {
	exec("ls -lah", function (error, stdout, stderr) {
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end(stdout);
	});
}

function show(response, request) {
	fs.readFile("./tmp/test.png", "binary", function(error, file) {
		if(!error) {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
		else {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		}
	});
}

function dumb_favicon(response, request) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
}

function bookRadarQuery(response, request) {
	var query = url.parse(request.url).query;
	var temp = querystring.parse(query);
	var keyword = temp.keyword;
	var size = temp.size;
	var id = temp.id;
	var page = temp.page;
	if(keyword && size) {
		BookRadarQuery.initQuery(keyword, size, function(result) {
			_doRsp(response, result);
		});
	} 
	else if(id && page) {
		BookRadarQuery.query(id, page, function(result) {
			_doRsp(response, result);
		});
	}
	else {
		_doWithBadRequest(response, request);
	}
}

function bookRadarClearQuery(response, request) {
	var query = url.parse(request.url).query;
	var temp = querystring.parse(query);
	var id = temp.id;
	if(id) {
		BookRadarQuery.clear(id, function(result) {
			_doRsp(response, result);
		});
	}
	else {
		_doWithBadRequest(response, request);
	}
}

function _doRsp(response, obj) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(JSON.stringify(obj));
	response.end();
}

function _doWithBadRequest(response, request) {
	response.writeHead(400, {"Content-Type": "text/plain"});
	response.write("Bad request:" + request.url);
	response.end();
}

exports.start = start;
exports.upload = upload;
exports.handlers = {
   "/": start, 
   "/start": start,
   "/upload": upload,
   "/list": list,
   "/show": show,
   "/proxy": proxy,
   "/library": library,
   "/search": search,
   "/searchDouban": searchDouban,
   "/searchLibrary": searchLibrary,
   "/query": bookRadarQuery,
   "/clear": bookRadarClearQuery,
   "/favicon.ico": dumb_favicon
};