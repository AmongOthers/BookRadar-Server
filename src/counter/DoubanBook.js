var Book = require("./Book");

function DoubanBook(title) {
	this._title = title;
	this._titles = Book.splitTitle(title);
}

DoubanBook.prototype.getTitle = function() {
	return this._title;
}

DoubanBook.prototype.getTitles = function() {
	return this._titles;
}

DoubanBook.prototype.getRating = function() {
	return Math.round(this.rating.average);
}

module.exports = DoubanBook;