const product = require('../../../var');
const mongoose = require('mongoose');
const conn = mongoose.createConnection("mongodb://localhost:27017/asinDB", { useNewUrlParser: true, useUnifiedTopology: true });
const basicAsinSchema = require('./basic_asin_schema');
const basicAsinDB = basicAsinSchema;
const Asin = conn.model("Asin", basicAsinDB);
module.exports = basicAsinDB;

function createNewAsin(){
product.newAsin = new Asin({
    asinId: product.asin,
    parentAsinId: product.parentAsin,
    categoryId: product.category,
    fbaFeesId: product.fbaFee,
    buyBoxpriceId: product.curentPrice,
    bsrId: product.currentBsr,
    avgPriceTd: product.usdPriceThirdydays,
    avgProfitTd: product.profitThirty,
    avgRoiTd: product.roiThirty,
    bsrIdTd: product.avgBsrRankThirtyDays,
    avgPriceSd: product.usdPriceSixydays,
    avgProfitSd: product.profitSixty,
    avgRoiSd: product.roiSixty,
    bsrIdSd: product.avgBsrRankSixtyDays,
    image: product.img1 + product.img2,
    dateRequest: product.date,
    amzUrl: product.prodUrl + product.asin,
    prodProfit: product.curentProfit,
    prodRoi: product.curentRoi,
    landedCost: product.costLanded,
    prodReferalFee: product.referalFee,
    supplierCost: product.csvCogs,
    AmazonIsSeller:product.isAmazonSeller
  });
}
module.exports=createNewAsin;