var DrawerInitState = {
		nextGrid: function(drawer, onNextGrid) {
			drawer._engine.getFirstGridAndTotalGridCount(function(error, totalGridCount, books) {
				if(!error) {
					drawer._totalGridCount = totalGridCount;
					drawer._grids[0] = books;
					if(totalGridCount > 1) {
						drawer._state = DrawerBusyState;
					}
					else {
						drawer._state = DrawerFullState;
					}
				}
				else {
					drawer._error = error;
					drawer._state = DrawerErrorState;
				}
				onNextGrid(error, books);
			});
		},
		isFull: function() {
			return false;
		}
}

 var DrawerBusyState = {
		nextGrid: function(drawer, onNextGrid) {
			var num = drawer._grids.length;
			drawer._engine.getGridOf(num, function(error, books) {
				if(!error) {
					drawer._grids[num] = books;
					if(drawer._grids.length == drawer._totalGridCount) {
						drawer._state = DrawerFullState;
					}
				}
				else {
					drawer._error = error;
					drawer._state = DrawerErrorState;
				}
				onNextGrid(error, books);
			});
		},
		isFull: function() {
			return false;
		}
}

var DrawerErrorState = {
		nextGrid: function(drawer, onNextGrid) {
			onNextGrid("already error: " + drawer._error, null);
		},
		isFull: function() {
		}
}

var DrawerFullState = {
		nextGrid: function(drawer, onNextGrid) {
			onNextGrid("already full", null);
		},
		isFull: function() {
			return true;
		}
}
Drawer.prototype.isFull = function() {
	return this._state.isFull();
}

//onNextGrid: function(error: object, books: Array<book>
Drawer.prototype.nextGrid = function(onNextGrid) {
	console.log("Drawer.nextGrid: " + this._grids.length);
	this._state.nextGrid(this, onNextGrid);
}

Drawer.prototype.getGridsLength = function() {
	return this._grids.length;
}

Drawer.prototype.getGrid = function(index) {
	return this._grids[index];
}

function Drawer(keyword, gridSize, engine) {
	this._keyword = keyword;
	this._gridSize = gridSize;
	this._engine = engine;
	this._totalResult = 0.0;
	this._totalGridCount = 0;
	this._grids = new Array();
	this._state = DrawerInitState;
	this._error = null;
}

module.exports = Drawer;