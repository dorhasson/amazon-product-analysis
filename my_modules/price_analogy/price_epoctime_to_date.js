const product = require('../var');

//trasfer keepa time to proper milisecond and then transfer the milisecond to dates//


function convertKeepaTimeForPrice(){
    product.miliSec = product.allDates.map(x => (x + product.addTime)*product.multiplyTime);
    product.epocTimeConvertor = product.miliSec.map(x => new Date(x).toISOString().split('T')[0]);
}

module.exports=convertKeepaTimeForPrice;