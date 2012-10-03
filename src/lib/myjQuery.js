//hack something to help jQuery plugins work
var $ = require("jquery");
global.window = $.create();
global.jQuery = $;
global.DOMParser = function() {
	return {
		parseFromString: function(text) {
			return $(text)[0];
		}
	};
};
window.jQuery = $;
//we require $
module.exports = $;