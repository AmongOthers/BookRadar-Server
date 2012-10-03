//onEndFunc: function(String)
function StringBuffer(onEndFunc) {
	this._str_ = "";
	this._array_ = new Array();
	this._onEndFunc_ = onEndFunc;
}

StringBuffer.prototype.append = function(str) {
	this._array_.push(str);
}

StringBuffer.prototype.flush = function() {
	this._str_ = this._array_.join("");
	this._onEndFunc_(this._str_);
}

module.exports = StringBuffer;
