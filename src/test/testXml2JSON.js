var Xml2JSON = require("../lib/Xml2JSON");

exports.testFindName = function(test) {
	var sample = "<root><name>zww</name></root>";
	var actual = Xml2JSON.findName(sample);
	test.equal(actual, "zww");
	test.done();
}

exports.testParse = function(test) {
	var sample = "<root><name>zww</name></root>";
	var actual = Xml2JSON.parse(sample);
	test.equal(actual.NAME, "zww");
	test.done();
}