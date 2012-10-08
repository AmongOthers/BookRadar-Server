var Drawer = require("./Drawer");
var DoubanEngine = require("./DoubanEngine");

function DoubanDrawer(counter, keyword, gridSize) {
	var engine = new DoubanEngine(counter, keyword, gridSize);
	Drawer.call(this, keyword, gridSize, engine);
	this._counter = counter;
}

DoubanDrawer.prototype = new Drawer();

module.exports = DoubanDrawer;