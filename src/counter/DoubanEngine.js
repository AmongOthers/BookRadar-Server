var $ = require("jquery"); 
var querystring = require("querystring");
var DoubanBook = require("./DoubanBook");
	
function DoubanEngine(counter, keyword, gridSize ) {
	this._keyword = keyword;
	this._gridSize = gridSize;
	this._counter = counter;
}

//onResult: function(error: object, totalGridCount: integer, books: Array)
DoubanEngine.prototype.getFirstGridAndTotalGridCount = function(onResult) {
	var params = {
		"q" : this._keyword,
		"max-results" : this._gridSize
	};
	var url = makeDoubanUrl(params);
	var self = this;
	this._counter.access(url, function(result) {
		var totalGridCount = parseTotalGridCount(result, self._gridSize);
		if(totalGridCount >= 0) {
			if(totalGridCount > 0) {
				var books = parseGrid(result);
				if(books) {
					onResult(null, totalGridCount, books);
				}
				else {
					onResult("parse " + result + " error", null, null);
				}
			}
			else {
				onResult(null, 0, []);
			}
		}
	}, function(error) {
		onResult(error, null, null);
	});
}

//onResult: function(error: object, books: Array)
DoubanEngine.prototype.getGridOf = function(num, onResult) {
	var params = {
			q: this._keyword,
			"max-results": this._gridSize,
			startIndex: 0,
	};
	params.startIndex = this._gridSize * num + 1;
	var url = makeDoubanUrl(params);
	var self = this;
	this._counter.access(url, function(result) {
		var books = parseGrid(result);
		if(books) {
			onResult(null, books);
		}
		else {
			onResult("parse " + result + " error", null);
		}
	}, function(error) {
		onResult(error, null);
	});
}

function parseGrid(str) {
	var headPos = str.indexOf("<entry>");
	var tailPos = str.lastIndexOf("</entry>"); if(!(headPos && tailPos)) {
		return null;
	}
	var entries = "<entries>" + str.substring(headPos, tailPos + 8)
			+ "</entries>"
	var entriesDom = $(entries).find("entry");
	var books = new Array();
	entriesDom.each(function() {
		var title = $(this).find("title")[0].innerHTML;
		var book = new DoubanBook(title);
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

function parseTotalGridCount(str, gridSize) {
	var totalResultStr = str.match(/<opensearch:totalResults>(.*)<\/opensearch:totalResults>/);
	if (totalResultStr) {
		var totalResult = parseFloat(totalResultStr[1]);
		var totalGridCount = Math.ceil(totalResult / gridSize); 
		return totalGridCount;
	} else {
		return -1;
	}
}

var URL_BASE = "http://api.douban.com/book/subjects?";
function makeDoubanUrl(params) {
	return URL_BASE + querystring.stringify(params);
}

module.exports = DoubanEngine;