var DoubanCachedDrawer = require("../counter/DoubanCachedDrawer");
var DoubanBook = require("../counter/DoubanBook");

function MockDrawer(size, gridSize) {
	this._size = size;
	this._gridSize = gridSize;
	this._curBook = 0;
}

MockDrawer.prototype.nextGrid = function(onNextGrid) {
	if(!this.isFull()) {
		var books = [];
		while(books.length < this._gridSize && this._curBook < this._size) {
//			books.push(new DoubanBook("book" + this._curBook));
			books.push(new DoubanBook("book"));
			this._curBook++;
		}
		onNextGrid(null, books);
	}
	else {
		onNextGrid("full", null);
	}
}

MockDrawer.prototype.isFull = function() {
	return this._curBook == this._size;
}

exports.test0 = function(test) {
	var size = 100;
	var gridSize = 20;
	var resultGridSize = 20;
	runTest(test, size, gridSize, resultGridSize);
}

exports.test1 = function(test) {
	var size = 20;
	var gridSize = 20;
	var resultGridSize = 10;
	runTest(test, size, gridSize, resultGridSize);
}

exports.test2 = function(test) {
	var size = 101;
	var gridSize = 20;
	var resultGridSize = 20;
	runTest(test, size, gridSize, resultGridSize);
}

exports.test3 = function(test) {
	var size = 21;
	var gridSize = 20;
	var resultGridSize = 10;
	runTest(test, size, gridSize, resultGridSize);
}

exports.test4 = function(test) {
	var size = 10;
	var gridSize = 20;
	var resultGridSize = 10;
	runTest(test, size, gridSize, resultGridSize);
}

exports.test5 = function(test) {
	var size = 1;
	var gridSize = 20;
	var resultGridSize = 10;
	runTest(test, size, gridSize, resultGridSize);
}

exports.test6 = function(test) {
	var size = 11;
	var gridSize = 20;
	var resultGridSize = 10;
	runTest(test, size, gridSize, resultGridSize);
}

exports.test7 = function(test) {
	var size = 0;
	var gridSize = 20;
	var resultGridSize = 10;
	runTest(test, size, gridSize, resultGridSize);
}

function runTest(test, size, gridSize, resultGridSize, resultGridCount) {
	console.log("size: " + size + " gridSize: " + gridSize + " resultGridSize: " + resultGridSize);
	var leftBooksForLastGrid = size % resultGridSize;
	leftBooksForLastGrid = leftBooksForLastGrid == 0 ? resultGridSize : leftBooksForLastGrid;
	var mockDrawer = new MockDrawer(size, gridSize);
	var drawer = new DoubanCachedDrawer(resultGridSize, mockDrawer);
	var i = 0;
	var onNextGrid = function(error, books) {
		if(!error) {
			console.log("books.length: " + books.length);
			for(var j = 0; j < books.length; j++) {
				console.log(books[j]);
			}
		}
		else {
			console.log(error);
		}
		i++;
		if(i == resultGridCount) {
			test.equal(leftBooksForLastGrid, books.length);
			console.log(drawer._cachedBooks.length);
			console.log(drawer._drawer.isFull());
			test.ok(drawer.isFull());
			drawer.nextGrid(function(e, b) {
				test.equal(e, DoubanCachedDrawer.ERROR_FULL);
				test.done();
			});
		}
		else {
			test.equal(resultGridSize, books.length);
			drawer.nextGrid(onNextGrid);
		}
	};
	if(!drawer.isFull()) {
		drawer.nextGrid(onNextGrid);
	}
	else {
		drawer.nextGrid(function(e, b) {
			test.equal(e, DoubanCachedDrawer.ERROR_FULL);
			test.done();
		});
	}
}