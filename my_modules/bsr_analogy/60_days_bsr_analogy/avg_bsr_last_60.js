const product = require('../../var');

function getAvgBsrLastSixtyDays(){

  var h = new Date();
  var q = h.setDate(h.getDate()-30);
  var k = new Date(q).toISOString().split('T')[0]

  var lastSixtyDaysBsr = product.epocTimeBsrConvertor.filter(function(day){
    return day > k
    });

  var lenyBsrTwo = lastSixtyDaysBsr.length;

  var bsrRanksSixtyDays = product.allBsrRanks.slice(Math.max(product.allBsrRanks.length - Number(lenyBsrTwo), 0));
  product.avgBsrRankSixtyDays = Math.round(bsrRanksSixtyDays.reduce((a, b) => a + b, 0)/Number(lenyBsrTwo));

}

module.exports=getAvgBsrLastSixtyDays;