DoubanCounter = require("../counter/DoubanCounter");
require("../lib/Logger");

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
	fullQuery("hello", counter, test);
}

exports.testFull1 = function(test) {
	var counter = new DoubanCounter();
	counter.start();
	var savedDone = test.done;
	test.done = function() {
		counter.stop();
		savedDone();
	}
	fullQuery("海贼王", counter, test);
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
		fullQuery(keyword, counter, test);
	}
	fullQuery(keyword, counter, test);
}

function fullQuery(keyword, counter, test) {
	var queryTitle = keyword;
	var drawer = counter.query(queryTitle, 50);
	var ask = null;
	var annoyingAsker = {
			onNextGridOk: function(books) {
				console.log("onNextGridOk: " + this._okCount + " length: " + books.length);
				for(var i = 0; i < books.length; i++) {
					var rating = books[i].getRating();
					var stars = "";
					for(var j = 0; j < rating; j++) {
						stars += "*";
					}
					console.log(books[i].getTitle() + "\t" + stars);
				}
				this._okCount++;
				if(drawer.isFull()) {
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
				annoyingAsker.onNextGridOk(books);
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