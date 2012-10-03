var http = require("http");
var querystring = require("querystring");
var $ = require("../lib/myjQuery");

//TODO 没有API key的情况下，一份钟只能访问10次。
/*
 * 直到没有评价的书籍为止，将返回所有可用的结果
 * params:keyword:string, callback(err: object, books: array)
 */
var URL_BASE = "http://api.douban.com/book/subjects?";
exports.searchByKeyword = function(keyword, callback){
	var params = querystring.stringify({q: keyword});
	var url = URL_BASE + params;
	var page = "";
	http.get(url, function(res) {
		res.on("data", function(data) {
			page += data;
		});
		res.on("end", function() {
			var books = parsePage(page);
			if(books) {
				callback(null, books);
			}
			else {
				callback("parse error", null);
			}
		});
	}).on("error", function(err) {
		callback(err, null);
	});
}

function parsePage(page) {
	var headPos = page.indexOf("<entry>");
	var tailPos = page.lastIndexOf("</entry>");
	if(headPos && tailPos) {
		console.log("doubanBook page: " + page);
		var entries = "<entries>" + page.substring(headPos, tailPos + 8) + "</entries>"
		var entriesDom = $(entries).find("entry");
		var books = new Array();
		entriesDom.each(function() {
			var book = new Object();
			book["title"] = $(this).find("title")[0].innerHTML;
			$(this).find("db\\:attribute").each(function() {
				book[$(this).attr("name")] = this.innerHTML;
			});
			var rating = $(this).find("gd\\:rating:first");
			book["rating"] = {average: rating.attr("average"), max: rating.attr("max"),
					min: rating.attr("min"), numRaters: rating.attr("numRaters")};
			books.push(book);
		});
		return books;
	}
	else {
		return null;
	}
}