var pg = require('pg');
var conString = "postgres://postgres:ZZS2012@58.83.196.218/position_db";



var date = '2016-01-11';
var sum = '1000';
var d = 1.999;
var sum_cost = 0, sum_market =0 , sum_cost_asset = 0, sum_market_asset = 0;
var s1 = 0, s2 = 0 , s3 = 0 , s4 = 0;

var updateCash = "update everyday_position set cost_value = $1, cost_asset = $2,\
sectype= $7, market_value = $3, market_asset = $4\
 where seccode=$8 and pos_date=$5 and acct=$6;";
pg.connect(conString, function(err, client, done) {
			if(err) {
			throw err;
			}
			client.query(updateCash,
					[sum_cost-s1, sum_cost_asset-s2, sum_market-s3, sum_market_asset-s4, date, 'xingyunBqi', 'CashAndOther', 'M'], 
					function(err, result) {
						done();

						if(err) {
						console.log(err);
						throw err;
						}
						console.log(result);
					});
});
