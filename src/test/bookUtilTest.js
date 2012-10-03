var Util = require("../lib/Util");
var bookUtil = require("../lib/bookUtil");

exports.testGetTiltes = function(test) {
	var samples, expecteds;
	//samples form search gdut for "java" and "thingking in java", 
	samples = ["Java高级框架应用开发案例教程 [专著]：Struts2+Spring+Hibernate", 
	           "全国计算机等级考试专用辅导教程 [汇编]·二级Java：2012版",
	           "Java面向对象程序设计 [专著]",
	           "轻量级Java EE企业应用实战(第3版) [专著]：Struts 2＋Spring 3＋Hibernate整合开发",
	           "正则指引 [专著]＝Regular expression yet another introduction",
	           "Spring技术内幕 [专著]＝Spring internals：深入解析Spring架构与设计原理",
	           "Java编程思想 [专著]＝Thinking in Java",
	           "Thinking in Java [monograph]：4th ed.",
	           "Java编程思想 [中译文]",
	           "Thinking in Java =：Java 编程思想 ",
	           "Thinking in Java [monograph]＝Java编程思想",
	           "Java编程思想 [专著]：第二版",
	           "Thinking in Java [monograph]＝Java编程思想：Second edition",
	//search douban for "thinking in java".
	           "Thinking in Java",
	           "Thinking in Java (3rd Edition)",
	           "Java编程思想 （第4版）", 
	           "Java编程思想 Thinking in Java",
	           "Thinking in Java 4/e中文版",
	           "Thinking in Java 2E 中文版"];
	expecteds = [["JAVA高级框架应用开发案例教程"],
	             ["全国计算机等级考试专用辅导教程"], 
	             ["JAVA面向对象程序设计"],
	             ["轻量级JAVAEE企业应用实战"],
	             ["正则指引", "REGULAREXPRESSIONYETANOTHERINTRODUCTION"],
	             ["SPRING技术内幕", "SPRINGINTERNALS"],
	             ["JAVA编程思想", "THINKINGINJAVA"],
	             ["THINKINGINJAVA"],
	             ["JAVA编程思想"],
	             ["THINKINGINJAVA"],
	             ["THINKINGINJAVA", "JAVA编程思想"],
	             ["JAVA编程思想"],
	             ["THINKINGINJAVA", "JAVA编程思想"],
				 ["THINKINGINJAVA"], 
			     ["THINKINGINJAVA"],
			     ["JAVA编程思想"],
			     ["JAVA编程思想THINKINGINJAVA"],
                 ["THINKINGINJAVA"],
			     ["THINKINGINJAVA"]];
	runTests(samples, expecteds, bookUtil.getTitles, test);
	test.done();
};

exports.testGetAuthor = function(test) {
	var samples, expecteds;
	samples = ["（美）霍顿（Horton I.）  著，潘晓雷  等译", 
	           "埃克尔,", 
	           "李刚", 
	           "[美] Bruce Eckel",
	           "（美）文纳斯",
	           "Joshua Bloch",
	           "杨尊一 编译 张然等 改编"];
	expecteds = [["霍顿", "Horton", "I.", "潘晓雷"],
	             ["埃克尔"],
	             ["李刚"],
	             ["Bruce", "Eckel"],
	             ["文纳斯"],
	             ["Joshua", "Bloch"],
	             ["杨尊一", "张然"] ];
	runTests(samples, expecteds, bookUtil.getAuthors, test);
	test.done();
};

exports.testGetPublisher = function(test) {
	var sample, actual, expected;
	sample = "中国电力出版社";
	expected = "中国电力";
	actual = bookUtil.getPublisher(sample);
	test.equal(actual, expected);
	test.done();
};

function runTests(samples, expecteds, action, test) {
	for(var i = 0; i < samples.length; i++) {
		sample = samples[i];
		expected = expecteds[i];
		actual = action(sample);
		test.ok(Util.isArrayEqual(actual, expected), "expected: " + expected + " actual: " + actual);
	}
}