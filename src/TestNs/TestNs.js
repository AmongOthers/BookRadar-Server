var fs = require("fs");

var TestNs = {};

TestNs.TestClassA = require("./TestClassA");

/*
 * onResult: function(err: Object, files: String[])
 */
TestNs.load = function() {
	var result_files = [];
	
	var onFileFoundUnderRoot = function(path) {
		if(path != __filename) {
			result_files.push(path);
		}
	}
	
	var onFileFoundUnderOtherDir = function(path) {
		result_files.push(path);
	}
	
	var findUnderDir = function(path, onFileFound) {
		var files = fs.readdirSync(path);
		if(files != null) {
			for(var i = 0; i < files.length; i++) {
				var fullPath = path + "/" + files[i];
				var stats = fs.statSync(fullPath);
				if(stats != null) {
					if(stats.isFile()) {
						onFileFound(fullPath);
					}
					else {
						  if(!findUnderDir(fullPath, onFileFoundUnderOtherDir)) {
							  return false;
						  }
					}
				}
				else {
					return false;
				}
			}
		}
		else {
			return false;
		}
		return true;
	} 
	
	if(findUnderDir(__dirname, onFileFoundUnderRoot)) {
		return result_files;
	}
	else {
		return null;
	}
}

module.exports = TestNs;