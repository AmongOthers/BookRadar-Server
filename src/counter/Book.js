function Book() {
	
}

Book._splitTitle = function(str) {
	//去除空白字符
	var temp = str.replace(/\s+/g, "");
	//去除注释, 注意懒惰
	temp = temp.replace(/\[.*?\]/g, "");
	temp = temp.replace(/\(.*?\)/g, "");
	temp = temp.replace(/（.*?）/g, "");
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