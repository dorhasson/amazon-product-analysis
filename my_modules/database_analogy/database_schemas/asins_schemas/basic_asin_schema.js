const mongoose = require('mongoose');

const asinSchema = new mongoose.Schema ({
    asinId:String,
    parentAsinId:String,
    categoryId:String,
    fbaFeesId:Number,
    buyBoxpriceId:Number,
    bsrId:Number,
    avgPriceTd:String,
    avgProfitTd:String,
    avgRoiTd:String,
    bsrIdTd:String,
    avgPriceSd:String,
    avgProfitSd:String,
    avgRoiSd:String,
    bsrIdSd:String,
    image:String,
    dateRequest:String,
    amzUrl:String,
    prodProfit:Number,
    prodRoi:Number,
    landedCost:Number,
    prodReferalFee:Number,
    supplierCost:Number,
    AmazonIsSeller:String
  });

  module.exports=asinSchema;