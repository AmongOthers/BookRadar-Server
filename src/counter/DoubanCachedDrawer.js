var bind = require("../lib/bind");
var DoubanCandinate = require("./DoubanCandinate");
var DoubanCandinateRef = require("./DoubanCandinateRef");

function DoubanCachedDrawer(booksPerGrid, drawer) {
	this._booksPerGrid = booksPerGrid;
	this._grids = [];
	this._cachedRefs = [];
	this._drawer = drawer;
}

DoubanCachedDrawer.ERROR_FULL = "ERROR_FULL";

DoubanCachedDrawer.prototype.nextGrid = function(onNextGrid) {
	if(this.isFull()) {
		onNextGrid(DoubanCachedDrawer.ERROR_FULL, null);
		return;
	}
	var self = this;
	var onGridFilled = function(resultGrid) {
		onNextGrid(null, resultGrid);
	}
	var grid = new Array();
	this._grids.push(grid);
	if(this._fillGridFromCache(grid, onGridFilled)) {
		return;
	}
	var myOnNextGrid = function(error, books) {
		if(!error) {
			this._fillCachedBooks(books);
			if(!this._fillGridFromCache(grid, onGridFilled)) {
				if(!this.isFull()) {
					this._drawer.nextGrid(bind(myOnNextGrid, this));
				}
			}
		}
		else {
			onNextGrid(error, null);
		}
	};
	this._drawer.nextGrid(bind(myOnNextGrid, this));
}

DoubanCachedDrawer.prototype.isFull = function() {
	return this._drawer.isFull() && this._cachedRefs.length == 0;
}

DoubanCachedDrawer.prototype.getGridsLength = function() {
	return this._grids.length;
}

DoubanCachedDrawer.prototype.getGrid = function(index) {
	return this._grids[index];
}

DoubanCachedDrawer.prototype._fillCachedBooks = function(books) {
	for(var i = 0; i < books.length; i++) {
		var book = books[i];
		if(book.getRating() == 0) {
			continue;
		}
		//如果这本书的标题有和以前的结果不同的，那么将这些新标题作为下一步要搜索的书存放
		var newCandinateRefs = this._buildCandinateRefs(book);
		for(var j = 0; j < newCandinateRefs.length; j++) {
			this._cachedRefs.push(newCandinateRefs[j]);
		}
	}
}

DoubanCachedDrawer.prototype._buildCandinateRefs = function(book) {
	var candinateRefs = [];
	if(!this._buildRefsIfRelativeToOldCandinate(book, candinateRefs)) {
		var candinate = new DoubanCandinate(book);
		var titles = book.getTitles();
		for(var i = 0; i < titles.length; i++) {
			var ref = new DoubanCandinateRef(titles[i], candinate);
			candinateRefs.push(ref);
		}
	}
	for(var i = 0; i < candinateRefs.length; i++) {
	}
	return candinateRefs;
}

DoubanCachedDrawer.prototype._buildRefsIfRelativeToOldCandinate = function(book, candinateRefs) {
	var thingsNew = this._getThingsNewAbout(book);
	if(thingsNew.candinate) {
		thingsNew.candinate.addRating(book.getRating());
		for(var i = 0; i < thingsNew.newTitles.length; i++) {
		thingsNew.candinate.addTitle(thingsNew.newTitles[i]);
			var ref = new DoubanCandinateRef(thingsNew.newTitles[i], thingsNew.candinate);
			candinateRefs.push(ref);
		}
	}
	return thingsNew.candinate != null;
}

DoubanCachedDrawer.prototype._fillGridFromCache = function(grid, onGridFilled) {
	while(this._cachedRefs.length > 0 && grid.length < this._booksPerGrid) {
		var book = this._cachedRefs.pop();
		grid.push(book);
	}
	grid.reverse();
	var isFilled = grid.length == this._booksPerGrid || this.isFull();
	if(isFilled) {
		onGridFilled(grid);
	}
	return isFilled;
}

DoubanCachedDrawer.prototype._getThingsNewAbout = function(book) {
	var candinate = null;
	var newTitles = [];
	var titles = book.getTitles();
	for(var i = 0; i < titles.length; i++) {
		candinate = this._getRelativeCandinate(titles[i]);
		if(!candinate) {
			newTitles.push(titles[i]);
		}
	}
	return {candinate: candinate, 
		newTitles: newTitles};
}

DoubanCachedDrawer.prototype._getRelativeCandinate = function(title) {
	for(var i = 0; i < this._cachedRefs.length; i++) {
		if(this._cachedRefs[i].getTitle() == title) {
			return this._cachedRefs[i].getCandinate();
		}
	}
	for(var i = 0; i < this._grids.length; i++) {
		var grid = this._grids[i];
		for(var j = 0; j < grid.length; j++) {
			if(grid[j].getTitle() == title) {
				return grid[j].getCandinate();
			}
		}
	}
	return null;
}

module.exports = DoubanCachedDrawer;