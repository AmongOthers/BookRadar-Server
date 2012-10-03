var star = {
	_name : "Jack",
	hirePerson : function(person) {
		person.signBook = function(book) {
			book.sign("This book is from " + this._name);
		}
	},
	hirePerson1: function(person) {
		var jack = this;
		person.signBook = function(book) {
			book.sign("This book is from " + jack._name);
		}
	},
	hirePerson2: function(person) {
		person.signBook = this.bind(function(book) {
			book.sign("This book is from " + this._name);
		}, this);
	},
   bind: function(fn, context) {
	　　return function() {
	　　　　return fn.apply(context, arguments);
	　　};
	}
};
var tom = {
	_name : "Tom"
};
var book = {
	sign : function(name) {
		console.log(name);
	}
};
star.hirePerson(tom);
tom.signBook(book);
star.hirePerson1(tom);
tom.signBook(book);
star.hirePerson2(tom);
tom.signBook(book);