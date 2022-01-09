const product = require('./var');


      function setDataResponse(asinData) {
        product.img2 = asinData.products[0].imagesCSV;
        product.asin = asinData.products[0].asin;
        product.parentAsin = asinData.products[0].parentAsin;
        product.category = asinData.products[0].categoryTree[0].name;
        product.fbaFee = asinData.products[0].fbaFees.pickAndPackFee / 100;
        product.currentTime = asinData.timestamp;
        product.isAmazonSeller = asinData.products[0].availabilityAmazon;

            //is Amazon Seller//
            function availabilityAmazon (){
              if(product.isAmazonSeller === -1){
                product.isAmazonSeller = "No"
              }else if(product.isAmazonSeller === 0){
                product.isAmazonSeller = "Yes"
              }else if(product.isAmazonSeller === 1){
                product.isAmazonSeller = "Yes , currently without stock" 
              }
            }
            availabilityAmazon();
          //End is Amazon Seller//

        // current Price analogy //
        function getCurrentPriceByCsvIndex(index) {
          product.priceHistory = asinData.products[0].csv[index];
          product.curentPrice = product.priceHistory[product.priceHistory.length-1] / 100;
        }

        function currentPriceIndex() {
          getCurrentPriceByCsvIndex(0);
          if (product.curentPrice = -1) {
            getCurrentPriceByCsvIndex(1);
          }
        }
        currentPriceIndex();
        //End current Price analogy//

        // current BSR analogy //   
        function getArrayOfMaximumLength(obj) {
          return Object
            .values(obj)
            .reduce((maxArr, arr) =>
              ((maxArr.length > arr.length) && maxArr) || arr   
            );
        }
        product.bsrHistory = asinData.products[0].salesRanks;
        product.relevantBsrArray = getArrayOfMaximumLength(product.bsrHistory);
        product.currentBsr = product.relevantBsrArray[product.relevantBsrArray.length-1];
        // End current BSR analogy //

       

        product.referalFee = Math.round(product.curentPrice / 10);
        product.costLanded = Number(product.csvCogs) + Number(product.fbaFee) + Number(product.referalFee);
        product.curentProfit = Math.round(Number(product.curentPrice) - Number(product.costLanded));
        product.curentRoi = Math.round(Number(product.curentProfit) / Number(product.costLanded) * 100);
        product.date = new Date(product.currentTime).toISOString().split('T')[0];
        
    
      }

      module.exports = setDataResponse;