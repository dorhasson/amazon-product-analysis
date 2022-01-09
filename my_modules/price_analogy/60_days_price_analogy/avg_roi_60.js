const product = require('../../var');

function getAvgRoiSixtyDays(){
    product.roiSixty = Math.round(Number(product.profitSixty) / Number(product.costLanded) * 100);
}

module.exports=getAvgRoiSixtyDays;