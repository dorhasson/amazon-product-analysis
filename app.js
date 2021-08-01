const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const decompressResponse = require("decompress-response");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/asinDB", {useNewUrlParser: true, useUnifiedTopology: true});

const asinSchema = {
  asinId:String,
  parentAsinId:String,
  categoryId:String,
  subCategoryId:String,
  feesId:String
};

const Asin = mongoose.model("Asin", asinSchema);

var asin = '';
var asinData = '';
var parentAsin = '';
var category = '';
var subCategory = '';
var fbaFee = '';
var currentTime = '';
var date = '';
var priceHistory = '';
var curentPrice = '';

app.get("/", function(req, res) {
  Asin.findOne({asinId:asin},function(err){
    if(!err){
     res.render("home",{asinNumber:asin,categoryNumber:category,subCategoryNumber:subCategory,fbaFeeNumber:fbaFee,date:date,priceNumber:curentPrice});
    }
    // res.sendFile(__dirname + "/index.html");
  });
});


app.post("/", function(req, res) {

//console.log(req.body.asinId);
const query = req.body.asinIdInput;
const apiKey = "86926qgjjrrdfsabahmia23vs6ebnflr00ace9rafu23p5ebdee2h8suavm75b4r";
const url = "https://api.keepa.com/product?key=" + apiKey + "&domain=1&asin=" + query;

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Accept-Encoding":"gzip"
  }
}

  https.get(url,options,function(response) {
  response = decompressResponse(response);
  console.log(res.statusCode);
  console.log(res.headers);
  var data = '';

  response.on("data", function(chunk){
  data += chunk;
  });

  response.on("end",function(){
  asinData = JSON.parse(data);
  asin = asinData.products[0].asin;
  parentAsin = asinData.products[0].parentAsin;
  category = asinData.products[0].categoryTree[1].name;
  subCategory = asinData.products[0].categoryTree[0].name;
  fbaFee = asinData.products[0].fbaFees.pickAndPackFee/100;
  currentTime = asinData.timestamp;
  priceHistory = asinData.products[0].csv[0];
  curentPrice = asinData.products[0].csv[0][1]/100;

  date = new Date(currentTime).toISOString().split('T')[0];

   // console.log(data);

  const newAsin = new Asin({
    asinId:asin,
    parentAsinId:parentAsin,
    categoryId:category,
    subCategoryId:subCategory,
    feesId:fbaFee
  });

  newAsin.save(function(err){
    if(!err){
      res.redirect("/");
    }else{
      console.log(err);
    }
  });
  // var digit = currentTime.toString().slice(0,6);
  // console.log(digit);
  // res.write("<h1>The Asin is " + asin + "</h1>");
  });

  });


});


  app.listen(3000, function() {
  console.log("server is running on port 3000");
});
