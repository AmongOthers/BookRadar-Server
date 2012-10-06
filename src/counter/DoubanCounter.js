DoubanDrawer = require("./DoubanDrawer");
DoubanAccessTask = require("./DoubanAccessTask");
DoubanDrawerProxy = require("./DoubanDrawerProxy");
DoubanCachedDrawer = require("./DoubanCachedDrawer");
bind = require("../lib/bind");

var VALVE_OPEN_COUNT = 6;

function DoubanCounter() {
	this._intervalId = -1;
}

DoubanCounter.prototype.start = function() {
	this._intervalId = setInterval(bind(this._checkTask, this), 1000);
	this._accessValve = 0;
	this._tasks = [];
	this._drawers = {};
}

DoubanCounter.prototype.stop = function() {
	clearInterval(this._intervalId);
}

DoubanCounter.prototype._checkTask = function() {
	if(this._accessValve < 1) {
		var task = this._tasks.pop();
		if(task) {
			this._accessValve = VALVE_OPEN_COUNT;
			task.excute();
		}
	}
	this._accessValve--;
}

DoubanCounter.isAccessLimitExceededError = function(error) {
	return DoubanAccessTask.isAccessLimitExceededError(error);
}

DoubanCounter.prototype.query = function(keyword, resultPerGrid, listener) {
	var resultDrawer;
	//去除空白字符
	keyword = keyword.replace(/\s+g/, "");
	if(!this._drawers[keyword]) {
		var drawer = new DoubanDrawer(this, keyword, resultPerGrid, listener);
		resultDrawer = new DoubanCachedDrawer(resultPerGrid, drawer);
		this._drawers[keyword] = resultDrawer;
	}
	else {
		resultDrawer = this._drawers[keyword];
	}
	return new DoubanDrawerProxy(resultDrawer);
}

DoubanCounter.prototype.access = function(url, onResult, onError) {
	var task = new DoubanAccessTask(url, onResult, onError);
	this._tasks.push(task);
}

module.exports = DoubanCounter;