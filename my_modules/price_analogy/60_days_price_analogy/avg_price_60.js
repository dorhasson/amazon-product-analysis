const product = require('../../var');

   //Get Last 60 days AVG price//

function getAvgPriceSixtyDays(){
    var p = new Date();
   var m = p.setDate(p.getDate()-60);
   var k = new Date(m).toISOString().split('T')[0];
 
   var lastSixtyDays = product.epocTimeConvertor.filter(function(day){
   return day > k
   });
 
   var lenyTwo = lastSixtyDays.length;
 
   var pricesSixtyDays = product.allPrices.slice(Math.max(product.allPrices.length - Number(lenyTwo), 0));
   var avgPriceSixtyDays = pricesSixtyDays.reduce((a, b) => a + b, 0)/Number(lenyTwo);
   product.usdPriceSixydays = Math.round(Number(avgPriceSixtyDays) / 100);
}

module.exports=getAvgPriceSixtyDays;