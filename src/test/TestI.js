var printActions = new Array();
for(var i = 0; i < 10; i++) {
    printActions.push(function() {
        console.log(i);
    });
}
for(var j = 0; j < printActions.length; j++) {
	var i = 10;
    printActions[j]();
}