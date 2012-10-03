var sCachedQueries = [];
var sID = 0;

function BookRadarQuery(keyword, size) {
	this._keyword = keyword;
	this._size = size;
	this._count = Math.round(Math.random() * 500);
	this._totalPage = Math.round(this._count / this._size);
}

BookRadarQuery.prototype.getPage = function(page) {
	var books = [];
	var base = page * this._size;
	for(var i = 0; i < this._size; i++) {
		var index = base + i;
		if(index >= this._count) {
			break;
		}
		var book = {
				title: this._keyword + index,
				author: "zhengwenwei",
				rating: Math.round(Math.random() * 5),
				index: "TP" + index
		};
		books.push(book);
	}
	return books;
}

BookRadarQuery.nextID = function() {
	return sID++;
}

BookRadarQuery.initQuery = function(keyword, size, onResult) {
	var id = BookRadarQuery.nextID();
	var query = new BookRadarQuery(keyword, size);
	sCachedQueries[id] = query;
	var books = query.getPage(0);
	var result = {
			id: id,
			books: books,
			totalPage: query._totalPage
	};
	onResult(result);
}

BookRadarQuery.query = function(id, page, onResult) {
	var query = sCachedQueries[id];
	var books = query.getPage(page);
	var result = {
			isFull: page >= query._totalPage,
			books: books
	};
	onResult(result);
}

BookRadarQuery.clear = function(id, onResult) {
	sCachedQueries[id] = undefined;
	var result = {
			isSucceeded: true
	};
	onResult(result);
}

module.exports = BookRadarQuery;
