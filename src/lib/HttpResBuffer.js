var StringBuffer = require("./StringBuffer");

function HttpResBuffer(onEndFunc) {
	StringBuffer.call(this, onEndFunc);
}
HttpResBuffer.prototype = new StringBuffer();
HttpResBuffer.prototype.onRes = function(res) {
	var savedThis = this;
	res.on("data",  function(data) {
		savedThis.append(data.toString());
	});
	res.on("end", function() {
		savedThis.flush();
	});
}

module.exports = HttpResBuffer;