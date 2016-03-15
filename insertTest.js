var XLSX = require('xlsx');
var pg = require('pg');
var fs = require('fs'),
readline = require('readline');

var SecuCode = [];
var rd = readline.createInterface({
    input: fs.createReadStream('./SecuCode.txt'),
    terminal: false
});

var i = 1;
rd.on('line', function(line) {
    SecuCode.push(line);
    i++;
});
rd.on('close', function(){
	SecuCode[SecuCode.length - 1] = SecuCode[SecuCode.length - 1].substring(0, SecuCode[SecuCode.length - 1].length -1);
	insertSql();
})


function insertSql(a, b, c, d, e, f, g, h, i,j)
{

	var conString = "postgres://postgres:ZZS2012@58.83.196.218/position_db";
	var acct = "asd";
	var seccode = "21313";
	var sectype = "qweqw";
	var size = "12.0";
	var price = "123.987";
	console.log(SecuCode.length);

	//我需要对这个seccode做个判断 这个字符串在Secucode中的话 sectype赋值ETF
	var insertString = "insert into everyday_position values ($1, $2, $3, $4, $5, \
	$6, $7, $8, $9, $10);";
	pg.connect(conString, function(err, client, done) {
				if(err) {
				throw err;
				}
				client.query(insertString,['2016-11-22', acct, seccode, sectype, size, price], 
						function(err, result) {
							done();

							if(err) {
							console.log(err);
							throw err;
							}
							console.log(result);
						});
			});

}