var fs = require("fs");

function formatWithSep(year, month, day, hour, minute, second) {
	return year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
};

function formatWithoutSep(year, month, day, hour, minute, second) {
	return year + month + day + hour + minute + second;
};

function format(date, formatDelegate) {
	var year = date.getFullYear().toString();
	var month = fillAsTwoDigit((date.getMonth() + 1).toString());
	var day = fillAsTwoDigit(date.getDate().toString());
	var hour = fillAsTwoDigit(date.getHours().toString());
	var minute = fillAsTwoDigit(date.getMinutes().toString());
	var second = fillAsTwoDigit(date.getSeconds().toString());
	return formatDelegate(year, month, day, hour, minute, second);
}

function fillAsTwoDigit(str) {
	if(str.length < 2) {
		str = "0" + str;
	}
	return str;
}

var LOG_DIR = "SERVER_LOG";
if(!fs.existsSync(LOG_DIR)) {
	fs.mkdirSync(LOG_DIR);
}
var logStream = fs.createWriteStream(LOG_DIR + "/" + format(new Date(), formatWithoutSep));
var savedLog = console.log;
console.log = function (message) {
	message = format(new Date(), formatWithSep) + "\t" + message;
	logStream.write(message + "\n");
	savedLog(message);
};