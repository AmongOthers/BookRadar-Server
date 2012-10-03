var iconv = require("iconv-lite");

function encode(str) {
	var FLAG = 0x81;
	var gbkStr = iconv.encode(str, "GBK");
	var result = "";
	var isGbkChar = false;
	var ch;
	for(var i = 0; i < gbkStr.length; i++) {
		ch = gbkStr[i];
		if(isGbkChar) {
			isGbkChar = false;
			result += "%" + ch.toString(16);
			continue;
		}
		if(ch <= FLAG) {
			result += String.fromCharCode(ch);
		}
		else {
			isGbkChar = true;
			result += "%" + ch.toString(16);
		}
	}
	return result;
}

exports.encode = encode;