function TestClassA() {
	
}

TestClassA.prototype.sayHello = function() {
	console.log("I'm form TestNs namespace");
}

module.exports = TestClassA;
