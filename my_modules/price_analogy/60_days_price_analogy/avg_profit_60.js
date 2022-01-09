const product = require('../../var');

function getAvgProfitSixtyDays(){
    product.profitSixty = Math.round(Number(product.usdPriceSixydays) - Number(product.costLanded));
}

module.exports=getAvgProfitSixtyDays;