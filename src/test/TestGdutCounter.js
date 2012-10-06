var GdutCounter = require("../counter/GdutCounter");

exports.testQuery = function(test) {
	var gdutCounter = new GdutCounter();
	var gridSize = 50;
	var drawer = gdutCounter.query("java", gridSize)
	drawer.nextGrid(function(error, books) {
		test.ok(!error);
		test.equal(books.length, gridSize);
	});
}