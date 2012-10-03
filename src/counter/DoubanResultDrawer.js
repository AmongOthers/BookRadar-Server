function DoubanResultDrawer(booksPerGrid, drawer) {
	this._booksPerGrid = booksPerGrid;
	this._grids = [];
	this._cachedBooks = [];
	this._drawer = drawer;
	this._isFull = false;
}

DoubanResultDrawer.prototype.nextGrid = function(onNextGrid) {
	var grid = new Array();
	var onGridFilled = function() {
		this._grids.push(grid);
		onNextGrid(null, grid);
	}
	if(_fillGrid(grid, this._cachedBooks)) {
		onGridFilled();
		return;
	}
	var myOnNextGrid = function(error, books) {
		if(!error) {
			this._cachedBooks = books;
			if(_fillGrid(grid, books)) {
				onGridFilled();
			}
			else {
				if(!this._drawer.isFull()) {
					this._drawer.nextGrid(myOnNextGrid);
				}
				else {
					this._isFull = true;
					onGridFilled();
				}
			}
		}
		else {
			onNextGrid(error, null);
		}
	};
	this._drawer.nextGrid(myOnNextGrid);
}

DoubanResultDrawer.prototype.isFull = function() {
	return this._isFull;
}

DoubanResultDrawer.prototype.getGridsLength = function() {
	return this._grids.length;
}

DoubanResultDrawer.prototype.getGrid = function(index) {
	return this._grids[index];
}

DoubanResultDrawer.prototype._isThisBookOK(book) {
	return true;
}

DoubanResultDrawer.prototype._fillGrid(grid, books) {
	while(books.length > 0 && grid.length < this._booksPerGrid) {
		var book = books.pop();
		if(_isThisBookOK(book)) {
			grid.push(book);
		}
	}
	return grid.length == this._booksPerGrid;
}


module.exports = DoubanResultDrawer;