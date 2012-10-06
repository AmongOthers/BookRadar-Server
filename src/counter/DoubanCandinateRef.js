function DoubanCandinateRef(title, candinate) {
	this._title = title;
	this._candinate = candinate;
}

DoubanCandinateRef.prototype.getTitle = function() {
	return this._title;
}

DoubanCandinateRef.prototype.getCandinate = function() {
	return this._candinate;
}

DoubanCandinateRef.prototype.getRating = function() {
	return this._candinate.getRating();
}

module.exports = DoubanCandinateRef;