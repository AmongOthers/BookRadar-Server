exports.testParse = function(test) {
	var sample = "<span class=\"title\"><a href=\"http://222.200.98.171:81/bookinfo.aspx?ctrlno=572768\" target=\"_blank\">新手学JavaFX [专著]</a></span>";
	var result = parseTitle(sample);
	var title = result.title;
	var detailUrl = result.detailUrl;
	test.equal(title, "新手学JavaFX [专著]");
	test.equal(detailUrl, "http://222.200.98.171:81/bookinfo.aspx?ctrlno=572768");
	test.done();
}

function parseTitle(str) {
	var detailUrl = str.match(/href="(.*?)"/)[1];
	var title = str.match(/<a.*>(.*)<\/a>/)[1];
	return {detailUrl: detailUrl, title: title};
}