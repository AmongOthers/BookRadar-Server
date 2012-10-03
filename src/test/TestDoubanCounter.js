DoubanCounter = require("../counter/DoubanCounter");
var counter = new DoubanCounter();

exports.testQuery = function(test) {
	counter.start();
	var drawer = counter.query("hello", 50,  {
		onInitDone: function(gridCount) {
			test.equal(gridCount, 39);
			test.equal(drawer._grids[0].length, 50);
		},
		onError: function(error) {
			test.fail(error);
			test.done();
		},
		onGridDone: function(gridNum) {
			console.log("!!!!!!!!!" + gridNum + " done" + "!!!!!!!!!");
		},
		onFull: function() {
			test.equal(drawer._grids.length, 39);
			test.done();
		}
	});
	drawer.start();
}