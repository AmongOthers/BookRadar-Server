var $ = require("../lib/myjQuery");
var jqueryXml2JSON = require("../jquery_plugin/jquery.xml2json.js");
var $ = window.jQuery;

function parse(xml) {
	return $.xml2json(xml);
}

function findName(xml) {
	var name = $(xml).find("name").text();
	return name;
}

exports.parse = parse;
exports.findName = findName;