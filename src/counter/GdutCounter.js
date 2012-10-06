var GdutDrawer = require("GdutDrawer");

function GdutCounter() {
	
}

GdutCounter.prototype.query = function(keyword, gridSize) {
	return new GdutDrawer(keyword, gridSize);
}

module.exports = GdutCounter;
