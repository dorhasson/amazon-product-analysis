const product = require('../../var');

//Get Last 30 days AVG ROI//
function getAvgRoiThirDays(){
product.roiThirty = Math.round(Number(product.profitThirty) / Number(product.costLanded) * 100);
};

module.exports=getAvgRoiThirDays;