const product = require('../var');

////////////////////////////////// PRICES ANALOGY /////////////////////////////////////
////////////////////// Saparate prices and dates to two differents arrays ////////////


function getDatesAndPrices(){
    for (var i = 0; i < product.priceHistory.length; i += 2) {
      product.allDates.push(product.priceHistory[i]);
      product.priceHistory[i+1] && product.allPrices.push(product.priceHistory[i + 1]);
  };
  };
  
  module.exports=getDatesAndPrices;