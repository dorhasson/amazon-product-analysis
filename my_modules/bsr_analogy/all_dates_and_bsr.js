const product = require('../var');

////////////////////////////////// BSR ANALOGY /////////////////////////////////////
////////////////////// Saparate BSR and dates to two differents arrays ////////////

  function getBsrDatesAndRanks(){
    for (var i = 0; i < product.relevantBsrArray.length; i += 2) {
      product.allBsrDates.push(product.relevantBsrArray[i]);
      product.relevantBsrArray[i+1] && product.allBsrRanks.push(product.relevantBsrArray[i + 1]);
  };
  };

  module.exports=getBsrDatesAndRanks;