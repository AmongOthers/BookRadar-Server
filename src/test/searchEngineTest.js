var searchEngine = require("../searchEngine/searchEngine");

//expected: Java语言程序设计 梁 / 王镁 / 机械工业出版社
exports.test0 = function(test) {
	var keyword = "Java语言程序设计";
	searchEngine.search(keyword, function(err, books) {
		test.ok(!err, "err: " + err)
		test.equal(books.length, 3);
		for(var i = 0; i < books.length; i++) {
			test.ok(books[i].index.match(/^TP312JA\/L49/));
		}
		test.done();
	});
};