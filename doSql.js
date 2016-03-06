var XLSX = require('xlsx');
function sqlActionInner(filename, callback)
{

  var seccode, date, cost_value, market_value;

  date = filename.substr(filename.length-14, 10);
  var xingYun = filename.substr(filename.length-17, 1);

  var workbook = XLSX.readFile(filename);
  var first_sheet_name = workbook.SheetNames[0];
  var address_of_cell = 'A5';

  /* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];

  /* Find desired cell */
  var desired_cell = worksheet[address_of_cell];

  /* Get the value */
  var desired_value = desired_cell.v;

  var sum = 0;
  for(var i = 5; i < 100; i++ ) {
   var ai = worksheet['A' + i];
   var ei = worksheet['E' + i];
   var hi = worksheet['H' + i];
   var ki = worksheet['K' + i];
   if(ai && ei && hi && ki && ki.v == '【正常交易】') {
      sum += ei.v;
      seccode = ai.v;
      seccode = seccode.substr(seccode.length-6, 6);
      cost_value = ei.v;
      market_value = hi.v;
      console.log(seccode, date, cost_value, market_value, xingYun);
      callback(seccode, date, cost_value, market_value, xingYun);
   }
  }
}


var transName = function(x) {
  return 'xingyun' + x +'qi';
}

function sqlAction(filename)
{
  sqlActionInner(filename, function(a, b, c, d, e) {

    var pg = require('pg');
    var conString = "postgres://postgres:ZZS2012@58.83.196.218/position_db";


    var updateString = 'update everyday_position set cost_value = $1, market_value = $2 where seccode=$3 and pos_date=$4 and acct=$5;';
    pg.connect(conString, function(err, client, done) {
      if(err) {
        throw err;
      }
      client.query(updateString,
        [c, d, a, b,transName(e)], 
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