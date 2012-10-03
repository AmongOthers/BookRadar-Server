var TestNs = require("../TestNs/TestNs");

exports.testTestNs = function(test) {
	if(!TestNs.TestClassA) {
		test.fail("TestNs.TestClassA undefiend");
		test.done();
	}
	var a = new TestNs.TestClassA();
	a.sayHello();
	test.done();
}

exports.testLoad = function(test) {
	var files = TestNs.load();
	test.ok(files != null);
	for(var i = 0; i < files.length; i++) {
			console.log(files[i]);
		}
	test.done();
}