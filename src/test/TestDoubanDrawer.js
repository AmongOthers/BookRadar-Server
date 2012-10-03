DoubanCounter = require("../counter/DoubanCounter");

exports.testNextGrid = function(test) {
	var savedDone = test.done;
	test.done = function() {
		counter.stop();
		savedDone();
	}
	var counter = new DoubanCounter();
	counter.start();
	var drawer = counter.query("hello", 50);
	drawer.nextGrid(function(error, books) {
		if(!error) {
			test.ok(books.length, 50);
		}
		else {
			test.fail(error);
		}
		test.done();
	});
}

exports.testFull = function(test) {
	var counter = new DoubanCounter();
	counter.start();
	var savedDone = test.done;
	test.done = function() {
		counter.stop();
		savedDone();
	}
	fullQuery("hello", 39, counter, test);
}

exports.testFull1 = function(test) {
	var counter = new DoubanCounter();
	counter.start();
	var savedDone = test.done;
	test.done = function() {
		counter.stop();
		savedDone();
	}
	fullQuery("海贼王", 1, counter, test);
}

exports.testQueryCached = function(test) {
	var counter = new DoubanCounter();
	counter.start();
	var keyword = "hello";
	var count = 39;
	var savedDone = test.done;
	test.done = function() {
		var startDate = new Date();
		test.done = function() {
			var stopDate = new Date();
			var elapsedSeconds = stopDate - startDate;
			test.ok(elapsedSeconds < 10 * 10000, "actual elapsed: " + elapsedSeconds);
			savedDone();
			counter.stop();
		}
		fullQuery(keyword, count, counter, test);
	}
	fullQuery(keyword, count, counter, test);
}

function fullQuery(keyword, count, counter, test) {
	var queryTitle = keyword;
	var gridCount = count;
	var drawer = counter.query(queryTitle, 50);
	var ask = null;
	var annoyingAsker = {
			onNextGridOk: function() {
				console.log("onNextGridOk: " + this._okCount);
				this._okCount++;
				if(this._okCount == gridCount) {
					this.onFull();
				}
				else {
					ask();
				}
			},
			onNextGridError: function(error) {
				test.fail(error);
				test.done();
			},
			onFull: function() {
				test.ok(drawer.isFull());
				test.done();
			}
	};
	annoyingAsker._okCount = 0;
	(ask = function() {
		drawer.nextGrid(function(error, books) {
			if(!error) {
				annoyingAsker.onNextGridOk();
			}
			else {
				annoyingAsker.onNextGridError(error);
			}
		});
	})();
}

exports.testEmpty = function(test) {
	var counter = new DoubanCounter();
	counter.start();
	var savedDone = test.done;
	test.done = function() {
		counter.stop();
		savedDone();
	}
	var drawer = counter.query("hellokikkty", 50);
	drawer.nextGrid(function(error, books) {
		if(!error) {
			test.equal(books.length, 0);
			test.ok(drawer.isFull());
		}
		else {
			test.fail(error);
		}
		test.done();
	});
}