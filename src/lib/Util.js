exports.isArrayEqual = function(array0, array1) {
	if(array0 && array1 && array0.length == array1.length) {
		for(var i = 0; i < array0.length; i++) {
			if(array0[i] != array1[i]) {
				return false;
			}
		}
		return true;
	}
	return false;
};