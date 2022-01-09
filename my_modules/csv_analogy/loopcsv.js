const product = require('../var');
const https = require("https");
const decompressResponse = require("decompress-response");
const createNewAsin = require('../database_analogy/database_schemas/asins_schemas/createNewAsin');
const pullAllData = require('../data_functions');
const setDataResponse = require('../response_data');


async function loopCsv() {

    for (var i = 0; i < product.csvData.length; i++) {

        product.csvCogs = product.csvData[i][0];
        const csvQuery = product.csvData[i][1]; 
        const csvApiKey = process.env.API_KEY; 
        const csvUrl = "https://api.keepa.com/product?key=" + csvApiKey + "&domain=1&asin=" + csvQuery;

        keepAliveAgent = new https.Agent({ keepAlive: true });
        options = {
         method: "GET",
         headers: {
         "Content-Type": "application/json;charset=UTF-8",
         "Accept-Encoding": "gzip",
          "Connection": "Keep-Alive"
         }}
         options.agent = keepAliveAgent;
 
         https.get(csvUrl, options, function (response) {
         response = decompressResponse(response);
 
         var newData = '';
 
         response.on("data", function (chunk) {
           newData += chunk;
          //console.log(newData);
           });
 
         response.on("end", function () {
         asinData = JSON.parse(newData);
         setDataResponse(asinData); 

         pullAllData();
 
         createNewAsin();

         product.newAsin.save(function (err) {
         if (!err) {
           console.log('success');// res.redirect("/system");
         } else {
           console.log(err);
         }
         });

     });
 
   });
   
 };

}

module.exports=loopCsv;