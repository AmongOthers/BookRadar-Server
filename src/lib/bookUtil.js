//判断两本书是否相关：
//1.book1.title分割成标题关键字后，能在book0.title中匹配到(不是严格一致）
//2.book1.authors或者translators能在book0.authors中找到匹配项目
//3.book1.publisher过滤后能在book0.publisher中匹配
exports.isTwoBookRelative = function(libBook, doubanBook) {
	var titles = _getTitles(doubanBook.title);
	if(!_isAnyItemMatched(libBook.title, titles)) {
		return false;
	}
	var authors = _getAuthors(doubanBook.authors);
	if(authors) {
		if(!_isAnyItemMatched(libBook.authors, authors)) {
			return false;
		}
	}
	//图书馆的书将翻译者放在了authors中，检查translators是否可以寻到匹配
	var translators = _getTranslators(doubanBook.translators);
	if(translators) {
		if(!_isAnyItemMatched(libBook.authors, translators)) {
			return false;
		}
	}
	var publish = _getPublisher(doubanBook.publish);
	if(!libBook.publish.indexOf(publish) > 0) {
		return false;
	}
	return true;
}

function _isAnyItemMatched(content, itemArray) {
	for(var i = 0; i < itemArray.length; i++) {
		if(content.indexOf(itemArray[i]) >= 0) {
			return true;
		}
	}
	return false;
}

exports.getPublisher = _getPublisher;
exports.getAuthors = _getAuthors;
exports.getTranslators = _getTranslators;
exports.getTitles = _getTitles;

function _getPublisher(str) {
	var temp = str.replace("出版社", "");
	return temp;
}

function _getAuthors(str) {
	return getNames(str);
}

function _getTranslators(str) {
	return getNames(str);
};

//：后面的是副标题
function _getTitles (str) {
	//去除空白字符
	var temp = str.replace(/\s+/g, "");
	//去除注释
	temp = temp.replace(/\[.*\]/g, "");
	temp = temp.replace(/\(.*\)/g, "");
	temp = temp.replace(/（.*）/g, "");
	//去除副标题
	temp = temp.replace(/[:：·].*$/, "");
	//去除多余的＝结尾
	temp = temp.replace(/[==＝]$/, "");
	//转为大写 
	temp = temp.toUpperCase(); 
	//过滤中文版/英文版
	temp = temp.replace(/中文版/, "");
	temp = temp.replace(/英文版/, "");
	temp = temp.replace(/双语版/, "");
	//过滤豆瓣版本标记（2 e; 4/e)
	temp = temp.replace(/[0-9][\/]{0,1}[eE]/, "");
	//＝分割标题，注意这里使用的＝和输入法的=（英文）和=（中文）有区别，http://zh.wikipedia.org/wiki/%E7%AD%89%E4%BA%8E
	var titles = temp.split(/[==＝]/);
	return titles;
}

function getNames(str) {
	if(!str) {
		return null;
	}
	var temp = filterAsSoOnAction(str);
	temp = filterCountry(temp);
	//连续的字母或者汉字或者作为简称使用的.为作者
	temp = temp.match(/[\w\u4e00-\u9fa5\.]+/g);
	return filterAction(temp);
}

var ACTIONS = ["著", "编著", "编", "辑", "改编", "缩写", "编注", "汇释", "搜集整理", "译", "编译", "译编", "口述", "记录整理", "执笔"];

//过滤"等XX"
function filterAsSoOnAction(str) {
	var temp = str;
	var regexp;
	for(var i = 0; i < ACTIONS.length; i++) {
		regexp = new RegExp("等\\s*" + ACTIONS[i], "g");
		temp = temp.replace(regexp, "");
	}
	return temp;
}

//过滤作者的国家信息，例如： (美）
function filterCountry(str) {
	var result = str.replace(/[\(\（\[\【][\u4e00-\u9fa5][\)\）\]\】]/g, "");
	return result;
}

//词分割后过滤”编“，”译“这些词
function filterAction(authors) {
	var result = new Array();
	var isFiltered;
	var author;
	for(var i = 0; i < authors.length; i++) {
		author = authors[i];
		isFiltered = false;
		for(var j = 0; j < ACTIONS.length; j++) {
			if(ACTIONS[j] == author) {
				isFiltered = true;
				break;
			}
		}
		if(!isFiltered) {
			result.push(author);
		}
	}
	return result;
}