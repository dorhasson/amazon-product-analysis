var asin = '';
var asinData = '';
var parentAsin = '';
var category = '';
var fbaFee = '';
var referalFee = '';
var currentTime = '';
var date = '';
var priceHistory = '';
var curentPrice = '';
var img1 = 'https://images-na.ssl-images-amazon.com/images/I/';
var img2 = '';
var prodUrl = 'https://amazon.com/dp/';
var cogs = '';
var curentProfit = '';
var curentRoi = '';
var costLanded = '';

var addTime = 21564000;
var multiplyTime = 60000;
var allDates =[];
var allPrices =[];
var miliSec ='';
var epocTimeConvertor='';
var usdPriceThirdydays='';
var usdPriceSixydays='';
var profitThirty='';
var roiThirty='';
var profitSixty='';
var roiSixty='';
var bsrObjectKey='';
var bsrHistory='';
var currentBsr='';
var allBsrDates=[];
var allBsrRanks=[];
var avgBsrRankThirtyDays='';
var avgBsrRankSixtyDays='';
var isAmazonSeller='';
var relevantBsrArray='';
var csvData = [];
var fileStorageEngine='';
var csvCogs = '';
var newAsin ='';
module.exports = {asin,asinData,parentAsin,category,fbaFee,referalFee,currentTime,date,priceHistory,curentPrice,
                  img1,img2,prodUrl,cogs,curentProfit,curentRoi,costLanded,addTime,multiplyTime,allDates,allPrices,miliSec,
                epocTimeConvertor,usdPriceThirdydays,usdPriceSixydays,profitThirty,roiThirty,profitSixty,roiSixty,
                bsrObjectKey,bsrHistory,currentBsr,allBsrDates,allBsrRanks,avgBsrRankThirtyDays,avgBsrRankSixtyDays,
                isAmazonSeller,relevantBsrArray,csvData,fileStorageEngine,csvCogs,newAsin}