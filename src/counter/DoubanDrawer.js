var querystring = require("querystring");
var $ = require("jquery");
	
var URL_BASE = "http://api.douban.com/book/subjects?";
function makeDoubanUrl(params) {
	return URL_BASE + querystring.stringify(params);
}

var DoubanInitState = {
		nextGrid: function(drawer, onNextGrid) {
			drawer._getFirstGridAndTotalGridCount(function(error, books) {
				if(!error) {
					if(drawer._totalGridCount > 1) {
						drawer._state = DoubanBusyState;
					}
					else {
						drawer._state = DoubanFullState;
					}
				}
				else {
					drawer._error = error;
					drawer._state = DoubanErrorState;
				}
				onNextGrid(error, books);
			});
		},
		isFull: function() {
			return false;
		}
}

 var DoubanBusyState = {
		nextGrid: function(drawer, onNextGrid) {
			drawer._getGridOf(drawer._grids.length, function(error, books) {
				if(!error) {
					if(drawer._grids.length == drawer._totalGridCount) {
						drawer._state = DoubanFullState;
					}
				}
				else {
					drawer._error = error;
					drawer._state = DoubanErrorState;
				}
				onNextGrid(error, books);
			});
		},
		isFull: function() {
			return false;
		}
}

var DoubanErrorState = {
		nextGrid: function(drawer, onNextGrid) {
			onNextGrid("already error: " + drawer._error, null);
		},
		isFull: function() {
			return false;
		}
}

var DoubanFullState = {
		nextGrid: function(drawer, onNextGrid) {
			onNextGrid("already full", null);
		},
		isFull: function() {
			return true;
		}
}

function DoubanDrawer(counter, keyword, resultPerGrid) {
	this._counter = counter;
	this._keyword = keyword;
	this._resultPerGrid = resultPerGrid;
	this._totalResult = 0.0;
	this._totalGridCount = 0;
	this._grids = new Array();
	this._cachedBooks = new Array();
	this._state = DoubanInitState;
	this._error = null;
}

//return: true for is full
DoubanDrawer.prototype.isFull = function() {
	return this._state.isFull();
}

//onNextGrid: function(error: object, books: Array<book>
DoubanDrawer.prototype.nextGrid = function(onNextGrid) {
	this._state.nextGrid(this, onNextGrid);
}

DoubanDrawer.prototype.getGridsLength = function() {
	return this._grids.length;
}

DoubanDrawer.prototype.getGrid = function(index) {
	return this._grids[index];
}

DoubanDrawer.prototype._getFirstGridAndTotalGridCount = function(onNextGrid) {
	var params = {
		"q" : this._keyword,
		"max-results" : 50
	};
	var url = makeDoubanUrl(params);
	var self = this;
	this._counter.access(url, function(result) {
		if(self._parseTotalGridCount(result)) {
			if(self._totalGridCount > 0) {
				var books = self._parseGrid(result);
				if(books) {
					self._grids[0] = books;
					onNextGrid(null, self._grids[0]);
				}
				else {
					onNextGrid("parse " + result + " error", null);
				}
			}
			else {
				onNextGrid(null, []);
			}
		}
	}, function(error) {
		onNextGrid(error, null);
	});
}

DoubanDrawer.prototype._getGridOf = function(num, onNextGrid) {
	var params = {
			q: this._keyword,
			"max-results": 50,
			startIndex: 0,
	};
	params.startIndex = this._resultPerGrid * num + 1;
	var url = makeDoubanUrl(params);
	var self = this;
	this._counter.access(url, function(result) {
		var books = self._parseGrid(result);
		if(books) {
			self._grids[num] = books;
			onNextGrid(null, self._grids[num]);
		}
		else {
			onNextGrid("parse " + result + " error", null);
		}
	}, function(error) {
		onNextGrid(error, null);
	});
}

DoubanDrawer.prototype._parseGrid = function(str) {
	var headPos = str.indexOf("<entry>");
	var tailPos = str.lastIndexOf("</entry>"); if(!(headPos && tailPos)) {
		return null;
	}
	var entries = "<entries>" + str.substring(headPos, tailPos + 8)
			+ "</entries>"
	var entriesDom = $(entries).find("entry");
	var books = new Array();
	entriesDom.each(function() {
		var book = new Object();
		book["title"] = $(this).find("title")[0].innerHTML;
		$(this).find("db\\:attribute").each(function() {
			book[$(this).attr("name")] = this.innerHTML;
		});
		var rating = $(this).find("gd\\:rating:first");
		book["rating"] = {
			average : rating.attr("average"),
			max : rating.attr("max"),
			min : rating.attr("min"),
			numRaters : rating.attr("numRaters")
		};
		books.push(book);
	});
	return books;
}

DoubanDrawer.prototype._parseTotalGridCount = function(str) {
	var totalResultStr = str.match(/<opensearch:totalResults>(.*)<\/opensearch:totalResults>/);
	if (totalResultStr) {
		this._totalResult = parseFloat(totalResultStr[1]);
		this._totalGridCount = Math.ceil(this._totalResult / this._resultPerGrid); 
		return true;
	} else {
		return false;
	}
}

module.exports = DoubanDrawer;