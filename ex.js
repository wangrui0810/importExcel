var fs = require("fs");
var fsEx = require('fs-extra');
var sqlAction = require('./doSql.js');

console.log(sqlAction);

var xx = fs.readdirSync('D:/workspace/wr/file');
for (var key in xx) 
{
	var file_name = 'D:/workspace/wr/file/' + xx[key];
	sqlAction(file_name);
}







