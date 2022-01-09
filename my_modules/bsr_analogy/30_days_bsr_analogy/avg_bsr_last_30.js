const product = require('../../var');

function getAvgBsrLastThirtyDays(){

 var u = new Date();
 var v = u.setDate(u.getDate()-30);
 var z = new Date(v).toISOString().split('T')[0]

 var lastThirtyDaysBsr = product.epocTimeBsrConvertor.filter(function(day){
   return day > z
   });

 var lenyBsr = lastThirtyDaysBsr.length;

 var bsrRanksThirtyDays = product.allBsrRanks.slice(Math.max(product.allBsrRanks.length - Number(lenyBsr), 0));
 product.avgBsrRankThirtyDays = Math.round(bsrRanksThirtyDays.reduce((a, b) => a + b, 0)/Number(lenyBsr));
}

module.exports=getAvgBsrLastThirtyDays;