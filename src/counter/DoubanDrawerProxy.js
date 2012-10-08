function DoubanDrawerProxy(drawer) {
	this._drawer = drawer;
	this._index = 0;
}

DoubanDrawerProxy.prototype.nextGrid = function(onNextGrid) {
	if(this._index < this._drawer.getGridsLength()) {
		var books =  this._drawer.getGrid(this._index);
		this._index++;
		onNextGrid(null, books);
	}
	else {
		var self = this;
		var myOnNextGrid = function(error, books) {
			if(!error) {
				self._index++;
			}
			onNextGrid(error, books);
		};
		this._drawer.nextGrid(myOnNextGrid);
	}
}

DoubanDrawerProxy.prototype.isFull = function() {
	return this._drawer.isFull();
}

module.exports = DoubanDrawerProxy;