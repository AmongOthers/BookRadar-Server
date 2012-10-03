function bind(fn, context) {
　　return function() {
　　　　return fn.apply(context, arguments);
　　};
}

module.exports = bind;