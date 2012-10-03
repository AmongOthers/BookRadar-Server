var http = require("http");
HttpResBuffer = require("../lib/HttpResBuffer");
bind = require("../lib/bind");

var ACCESS_LIMIT_EXCEEDED = "You API access rate limit has been exceeded. ";

function DoubanAccessTask(url, onResult, onError) {
	this._url = url;
	this._onResult = onResult;
	this._onError = onError;
}

DoubanAccessTask.prototype.excute = function() {
	var callback = function(res) {
		if(res.match(ACCESS_LIMIT_EXCEEDED)) {
			this._onError(ACCESS_LIMIT_EXCEEDED);
		}
		else {
			this._onResult(res);
		}
	};
	var errorCallback = function(error) {
		this._onError(error);
	};
	var buffer = new HttpResBuffer(bind(callback, this));
	http.get(this._url, bind(buffer.onRes, buffer)).on("error", bind(errorCallback, this));
}

DoubanAccessTask.isAccessLimitExceededError = function(error) {
	return error == ACCESS_LIMIT_EXCEEDED;
}

module.exports = DoubanAccessTask;
	