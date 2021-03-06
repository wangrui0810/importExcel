var XLSX = require('xlsx');

var transName = function(x) {
	return 'xingyun' + x +'qi';
}

function sqlActionInner(filename, callback)
{

	var seccode, date, cost_value, market_value;

	date = filename.substr(62, 10);
	var xingYun = filename.substr(59, 1);
//	if(date != '2016-01-11')
//		return ;


	var workbook = XLSX.readFile(filename);
	var first_sheet_name = workbook.SheetNames[0];
	var address_of_cell = 'A5';

	/* Get worksheet */
	var worksheet = workbook.Sheets[first_sheet_name];

	/* Find desired cell */
	var desired_cell = worksheet[address_of_cell];

	/* Get the value */
	var desired_value = desired_cell.v;

	var sum_cost = 0,sum_cost_asset = 0;
	var sum_market = 0, sum_market_asset = 0;
	var s1 = 0, s2 = 0, s3 = 0, s4 = 0;
	/*计算现金持仓的每项数值 */

	for(var i = 5; i < 100; i++ ) {
		var ai = worksheet['A' + i];
		var ei = worksheet['E' + i];
		var hi = worksheet['H' + i];
		var ki = worksheet['K' + i];
		var fi = worksheet['F' + i];
		var ii = worksheet['I' + i];
		var ci = worksheet['C' + i];
		var di = worksheet['D' + i];

		if(ai && ai.v == '基金资产净值:')
		{
			sum_cost = ei.v;
			sum_market = hi.v;
			sum_cost_asset = fi.v/100;
			sum_market_asset = ii.v/100;
		}


		if(ai && ei && hi && ki && ki.v) {
			s1 += ei.v;
			s2 += fi.v/100;
			s3 += hi.v;
			s4 += ii.v/100;


			seccode = ai.v;
			seccode = seccode.substr(seccode.length-6, 6);
			cost_value = ei.v;
			market_value = hi.v;
			size = parseFloat(ci.v);
			price = parseFloat(di.v);




			console.log(seccode, date, cost_value, market_value, xingYun, size, price);
			callback(seccode, date, cost_value, market_value, xingYun, size, price);
		}
	}
//	console.log(s1, s2, s3, s4, transName(xingYun));
//	console.log(date);
	
	//将for循环遍历之后，求出总和， 现金持仓更新到数据库中
	var pg = require('pg');
	var conString = "postgres://postgres:ZZS2012@/position_db";


	var insertCash = "insert into everyday_position values( $5, $6, $8,\
		'', $8, $9, $2,, $4, $3, $1);";

	pg.connect(conString, function(err, client, done) {
				if(err) {
				throw err;
				}
				
				client.query(insertCash,
						[sum_cost-s1, sum_cost_asset-s2, sum_market-s3, sum_market_asset-s4, date, transName(xingYun), 'CashAndOther', 'M'], 
						function(err, result) {
							done();
							console.log('in sqlActionInner');
							console.log("现金持仓是", sum_cost-s1 , sum_cost_asset-s2, sum_market-s3, sum_market_asset-s4, transName(xingYun));
							if(err) {
							console.log(err);
							throw err;
							}
							console.log(result);
						});
	});

}


function sqlAction(filename)
{
	sqlActionInner(filename, function(a, b, c, d, e, f, g) {

	 		var pg = require('pg');
			var conString = "postgres://postgres:ZZS2012@58.83.196.218/position_db";

			console.log('begin insert into');
		    var insertString = 'insert into everyday_position set cost_value = $1, market_value = $2 ,seccode=$3 ,pos_date=$4 ,acct=$5;';
			pg.connect(conString, function(err, client, done) {
						if(err) {
						throw err;
						}
						console.log('in sqlAction');
						client.query(insertString,
								[c, d, a, b, transName(e), f, g], 
								function(err, result) {
									done();

									if(err) {
									console.log(err);
									throw err;
									}
									console.log(result);
								});
					});
	});
	console.log('sqlAction');
};

module.exports = sqlAction;
