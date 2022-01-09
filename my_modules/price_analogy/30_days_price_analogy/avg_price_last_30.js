const product = require('../../var');

 //Get Last 30 days AVG price//
function getAvgPrice30Days(){

  var d = new Date();
  var o = d.setDate(d.getDate()-30);
  var c = new Date(o).toISOString().split('T')[0];

  var lastThirtyDays = product.epocTimeConvertor.filter(function(day){
  return day > c
  });

  var leny = lastThirtyDays.length;

  var pricesThirtyDays = product.allPrices.slice(Math.max(product.allPrices.length - Number(leny), 0));
  var avgPriceThirtyDays = pricesThirtyDays.reduce((a, b) => a + b, 0)/Number(leny);
  product.usdPriceThirdydays = Math.round(Number(avgPriceThirtyDays) / 100);
 
};

module.exports=getAvgPrice30Days;