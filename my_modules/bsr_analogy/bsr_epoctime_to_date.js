const product = require('../var');

function convertKeepaTimeForBsr(){
    product.miliSecBsr = product.allBsrDates.map(x => (x + product.addTime)*product.multiplyTime);
    product.epocTimeBsrConvertor = product.miliSecBsr.map(x => new Date(x).toISOString().split('T')[0]);
}

module.exports=convertKeepaTimeForBsr;