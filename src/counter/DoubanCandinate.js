function DoubanCandinate(book) {
	this._titles = [];
	this._ratings = [];
	var bookTitles = book.getTitles();
	for(var i = 0; i < bookTitles.length; i++) {
		this._titles.push(bookTitles[i]);
	}
	var bookRating = book.getRating();
	this._ratings.push(bookRating);
	this._totalRating = bookRating;
}

DoubanCandinate.prototype.addTitle = function(title) {
	this._titles.push(title);
}

DoubanCandinate.prototype.addRating = function(rating) {
	this._ratings.push(rating);
	this._totalRating += rating;
}

DoubanCandinate.prototype.getRating = function() {
	return this._totalRating / this._ratings.length;
}

module.exports = DoubanCandinate;