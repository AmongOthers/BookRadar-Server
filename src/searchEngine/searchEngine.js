var bookUtil = require("../lib/bookUtil");
var library = require("../libraryEngine/gdut");
/*
 * params:keyword:string, callback(err: object, books: array)
 */
exports.search = function(keyword, callback) {
	console.log("douban search for: " + keyword + " begin: " + new Date());
	doubanBook.searchByKeyword(keyword, function(err, books) {
		console.log("douban search for: " + keyword + " end: " + new Date());
		if(!err) {
			//根据豆瓣的结果在图书馆中查询
			var libraryBooksDic = new Object();
			var count = 0;
			for(var i = 0; i < books.length; i++) {
				//不搜索豆瓣无人评价的书
				if(books[i].rating.average == "0") {
					continue;
				}
				(function(book) {
					console.log("library search for: " + book.title + " begin: " + new Date());
					library.searchByTitle(book.title, function(librarySearchErr, librarySearchBooks) {
						console.log("library search for: " + book.title + " end: " + new Date());
						if(!librarySearchErr) {
							var libraryBook;
							for(var j = 0; j < librarySearchBooks.length; j++) {
								libraryBook = librarySearchBooks[j];
								if(!isRelatviveToDoubanBook(libraryBook, book)) {
									continue;
								}
								var libraryIndex = libraryBook.index;
								//小心的预防图书馆搜索的结果不带索引号
								if(!libraryIndex) {
									continue;
								}
								//合并重复项，将豆瓣上相关的书记录下来
								if(!libraryBooksDic[libraryIndex]) {
									libraryBook.doubanRelativeBooks = new Array();
									libraryBook.doubanRelativeBooks.push(book);
									libraryBooksDic[libraryIndex] = libraryBook;
								}
								else {
									libraryBooksDic[libraryIndex].doubanRelativeBooks.push(book);
								}
							}
						}
						count++;
						if(count == books.length) {
							var resultBooks = new Array();
							for(var item in libraryBooksDic) {
								resultBooks.push(libraryBooksDic[item]);
							}
							callback(null, resultBooks);
						}
					});
				})(books[i]);
				
			}
		}
		else {
			callback(err, null);
		}
	});
}

//比较标题是否一致，同时比较豆瓣书籍中的作者，译者中的一个是否出现在图书馆的书中，同时比较出版社是否一致, 不分版本
function isRelatviveToDoubanBook(book, bookOfDouban) {
	console.log("bookOfLibrary: " + " title: " + book.title + " author: " + book.author + " publisher: " + book.publisher);
	console.log("bookOfDouban: " + " title: " + bookOfDouban.title + " author: " + bookOfDouban.author  + " translator: " + bookOfDouban.translator + " publisher: " + bookOfDouban.publisher);
	var result = bookUtil.isTwoBookRelative(book, bookOfDouban);
	console.log("result: " + result);
}