var DoubanBook = require("../counter/DoubanBook");

exports.testSplitTitle = function(test) {
	var title = "CD-R(DVD)海贼王全欣赏 (平装)";
	var expected = "CD-R海贼王全欣赏";
	var actual = DoubanBook._splitTitle(title);
	test.equal(actual.length, 1);
	test.equal(actual, expected);
	test.done();
}