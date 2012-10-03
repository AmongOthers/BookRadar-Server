var http = require("http");
var UrlGBKEncode = require("../lib/UrlGBKEncode");
var $ = require("../lib/myjQuery");

/*
 * params:keyword:string, callback(err: object, books: array)
 */
var QUERY_BY_KEYWORD = "http://222.200.98.171:81/searchresult.aspx?anywords=";
exports.searchByKeyword = function(keyword, callback) {
	var urlEncoded = UrlGBKEncode.encode(keyword);
	var url = QUERY_BY_KEYWORD + urlEncoded;
	search(url, callback);
}

/*
 * 题名前方一致
 * params:title:string, callback(err: object, books: array)
 */
var QUERY_BY_TITLE = "http://222.200.98.171:81/searchresult.aspx?title_f=";
exports.searchByTitle = function(title, callback) {
	var urlEncoded = UrlGBKEncode.encode(title);
	var url = QUERY_BY_TITLE + urlEncoded;
	search(url, callback);
}

function search(url, callback) {
	var page = "";
	http.get(url, function(res) {
		res.on("data", function(data) {
			page += data;
		});
		res.on("end", function() {
			var tbody = find_tbody(page);
			if(!tbody) {
				callback("tbody not found", null);
			}
			else {
				var books = parse_tbody(tbody);
				callback(null, books);
			}
		});
	}).on("error", function(err) {
		callback(err, null);
	});
}

function find_tbody(page) {
	var headPos = page.indexOf("<tbody>");
	var tailPos = page.lastIndexOf("</tbody>");
	if(headPos > 0 && tailPos > 0) {
		var tbody = page.substring(headPos, tailPos + 8);
		return tbody;
	}
	return null;
}

//"dumb"是指checkbox的单元格
var index2Field = ["dumb", "title", "author", "publisher", "year", "index", "total", "available", "resource"];
function parse_tbody(tbody) {
	var tbodyDom = $(tbody);
	var books = new Array();
	tbodyDom.find("tr").each(function() {
		var book = new Object();
		$(this).find("td").each(function(index) {
			//title单元格的格式是:
			//<span class="title"><a href="http://222.200.98.171:81/bookinfo.aspx?ctrlno=572768" target="_blank">新手学JavaFX [专著]</a></span>
			//有可能detailUrl省略了主机： bookinfo.aspx?ctrlno=572768"
			var field = index2Field[index];
			if(field == "title") {
				var titleTdStr = this.innerHTML;
				var titleTd = parseTitleTd(titleTdStr);
				book.title = titleTd.title;
				book.detailUrl = titleTd.detailUrl;
			}
			else if(field != "dumb") {
				book[field] = this.innerHTML;
			}
		})
		books.push(book);
	});
	return books;
}

function parseTitleTd(str) {
	var detailUrl = str.match(/href="(.*?)"/)[1];
	var title = str.match(/<a.*>(.*)<\/a>/)[1];
	return {detailUrl: detailUrl, title: title};
}	