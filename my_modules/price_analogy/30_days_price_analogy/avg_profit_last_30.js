const product = require('../../var');

//Get Last 30 days AVG profit//

function avgProfitThirtyDays(){
product.profitThirty = Math.round(Number(product.usdPriceThirdydays) - Number(product.costLanded));

}

module.exports=avgProfitThirtyDays;