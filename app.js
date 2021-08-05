require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const decompressResponse = require("decompress-response");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const conn = mongoose.createConnection("mongodb://localhost:27017/asinDB", {useNewUrlParser: true, useUnifiedTopology: true});
const conn2 = mongoose.createConnection("mongodb://localhost:27017/HteamUserDB", {useNewUrlParser: true, useUnifiedTopology: true});
const asinSchema = new mongoose.Schema ({
  asinId:String,
  parentAsinId:String,
  categoryId:String,
  feesId:Number,
  buyBoxpriceId:Number
});

const Asin = conn.model("Asin", asinSchema);

module.exports = asinSchema;

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


const User =conn2.model("User",userSchema);

module.exports = userSchema;


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
var avgPrice = '';
var curentProfit = '';
var curentRoi = '';
var costLanded = '';

var addTime = 21564000;
var multiplyTime = 60000;
var allDates =[];
var allPrices =[];
var miliSec ='';
var epocTimeConvertor='';

var last30Days='';

app.get("/", function(req, res) {
  Asin.findOne({asinId:asin},function(err){
    if(!err){
     res.render("home",{asinNumber:asin,categoryNumber:category,fbaFeeNumber:fbaFee,date:date,priceNumber:curentPrice,
     imageUrl:img1 + img2,productUrl:prodUrl+asin,cost:cogs,profit:curentProfit,roi:curentRoi,landed:costLanded,referal:referalFee});
    }
    // res.sendFile(__dirname + "/index.html");
  });
});


app.post("/", function(req, res) {

//console.log(req.body.asinId);
cogs = req.body.costIdInput;
const query = req.body.asinIdInput;
const apiKey = process.env.API_KEY;
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
  img2 = asinData.products[0].imagesCSV;
  asin = asinData.products[0].asin;
  parentAsin = asinData.products[0].parentAsin;
  category = asinData.products[0].categoryTree[0].name;
  fbaFee = asinData.products[0].fbaFees.pickAndPackFee/100;
  currentTime = asinData.timestamp;
  priceHistory = asinData.products[0].csv[0];
  curentPrice = priceHistory[priceHistory.length-1]/100;
  referalFee = Math.round(curentPrice/10);
  costLanded = Number(cogs) + Number(fbaFee) + Number(referalFee);
  curentProfit = Math.round(Number(curentPrice) - Number(costLanded));
  curentRoi = Math.round(Number(curentProfit) / Number(costLanded) * 100);
  date = new Date(currentTime).toISOString().split('T')[0];

  function getDatesAndPrices(){
    for (var i = 0; i < priceHistory.length; i += 2) {
    allDates.push(priceHistory[i]);
    priceHistory[i+1] && allPrices.push(priceHistory[i + 1]);
  };
  };
getDatesAndPrices();

//trasfer keepa time to proper milisecond and than transfer the milisecond to dates//

 miliSec = allDates.map(x => (x + addTime)*multiplyTime);
 epocTimeConvertor = miliSec.map(x => new Date(x).toISOString().split('T')[0]);

   // console.log(epocTimeConvertor);
   // console.log(allPrices);

  const newAsin = new Asin({
    asinId:asin,
    parentAsinId:parentAsin,
    categoryId:category,
    feesId:fbaFee,
    buyBoxpriceId:curentPrice
  });

  newAsin.save(function(err){
    if(!err){
      res.redirect("/");
    }else{
      console.log(err);
    }
  });
  // res.write("<h1>The Asin is " + asin + "</h1>");
  });

  });

});



app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});


app.post("/register", function (req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email:req.body.username,
      password:hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.redirect("/");
      }
    });
});

});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrypt.compare(password,foundUser.password,function(err,result){
        if(result===true){
        res.redirect("/");
        }
      });
      }
    }
  });
});

  app.listen(3000, function() {
  console.log("server is running on port 3000");
});
