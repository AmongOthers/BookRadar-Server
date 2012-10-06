var http = require("http");
var bind = require("../lib/bind");
var HttpResBuffer = require("../lib/HttpResBuffer");

function GdutDrawer(keyword, gridSize) {
	this._keyword = keyword;
	this._gridSize = gridSize;
	this._state = GdutDrawerInitState;
}

var GdutDrawerInitState = {
		nextGrid: function(drawer, onNextGrid) {
			var url = GdutDrawer._buildUrl(keyword, gridSize, 0);
			GdutDrawer._access(url, function(error, res) {
				if(!error) {
					
					drawer._state = GdutDrawerBusyState;
				}
				else {
					drawer._state = GdutDrawerErrorState;
				}
			});
		}
};

var GdutDrawerBusyState = {
		
};

var GdutDrawerFullState = {
		
};

var GdutErrorState = {
		
};

GdutDrawer.prototype.nextGrid = function(onNextGrid) {
	
}

GdutDrawer.prototype._getFirstGridAndTotalGridCount = 

GdutDrawer._access = function(url, onResult) {
	var callback = function(res) {
		onResult(null, res);
	};
	var errorCallback = function(error) {
		onResult(error, null);
	};
	var httpResBuffer = new HttpResBuffer(callback);
	http.get(url, bind(httpResBuffer.onRes, httpResBuffer)).on("error", errorCallback);;
}

var URL_BASE = "http://222.200.98.171:81/searchresult.aspx?anywords=<keyword>&dp=<gridSize>&page=<pageNum>";
GdutDrawer._buildUrl = function(keyword, gridSize, pageNum) {
	//gdut是以1开始
	return URL_BASE.replace("<keyword>", keyword).replace("<gridSize>", gridSize).replace("<pageNum>", pageNum + 1);
}

module.exports = GdutDrawer;