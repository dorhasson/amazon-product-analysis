require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const decompressResponse = require("decompress-response");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret:"Our little secret",
  resave:false,
  saveUninitialized:false,
  cookie: {
    secure: false,
    maxAge: 3600000 }
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set('useFindAndModify', false);
const conn = mongoose.createConnection("mongodb://localhost:27017/asinDB", {useNewUrlParser: true, useUnifiedTopology: true});
const conn2 = mongoose.createConnection("mongodb://localhost:27017/HteamUserDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);
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
  supplierCost:Number
});

const Asin = conn.model("Asin", asinSchema);

module.exports = asinSchema;

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(passportLocalMongoose);

const User =conn2.model("User",userSchema);

module.exports = userSchema;

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
//var avgPrice = '';
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

  const noData = new Asin({
    asinId:"Search for an Asin",
    parentAsinId:"",
    categoryId:"",
    fbaFeesId:0,
    buyBoxpriceId:0,
    bsrId:0,
    avgPriceTd:0,
    avgProfitTd:0,
    avgRoiTd:0,
    bsrIdTd:0,
    avgPriceSd:0,
    avgProfitSd:0,
    avgRoiSd:0,
    bsrIdSd:0,
    image:"",
    dateRequest:"",
    amzUrl:"",
    prodProfit:0,
    prodRoi:0,
    landedCost:0,
    prodReferalFee:0,
    supplierCost:0
  });

  const defaultAsin = [noData];

app.get("/",function(req,res){
  res.render("home");
});

app.get("/system", function(req, res) {
  if(req.isAuthenticated()){
  Asin.find({},function(err,foundData){

    if(foundData.lengh === 0){
      Asin.insertMany(defaultAsin,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("default mode apply");
        }
      });
      res.redirect("/system");
    }else{
      res.render("system",{asinNumber:asin,imageUrl:img1 + img2,productUrl:prodUrl+asin,amzAsinData:foundData});
    }
  });
}else{
  res.redirect("/login");
}
});


app.post("/system", function(req, res) {

//console.log(req.body.asinId);
cogs = req.body.costIdInput;
const query = req.body.asinIdInput;
const apiKey = process.env.API_KEY;
const url = "https://api.keepa.com/product?key=" + apiKey + "&domain=1&asin=" + query;

const keepAliveAgent = new https.Agent({ keepAlive: true });
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Accept-Encoding":"gzip",
    "Connection": "Keep-Alive"
  }
}

  https.get(url,options,function(response) {
  response = decompressResponse(response);
  console.log(res.statusCode);
  //console.log(res.headers);
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
  bsrObjectKey = (Object.keys(asinData.products[0].salesRanks)[1]);
  bsrHistory = asinData.products[0].salesRanks[bsrObjectKey];
  currentBsr = bsrHistory[bsrHistory.length-1];
  referalFee = Math.round(curentPrice/10);
  costLanded = Number(cogs) + Number(fbaFee) + Number(referalFee);
  curentProfit = Math.round(Number(curentPrice) - Number(costLanded));
  curentRoi = Math.round(Number(curentProfit) / Number(costLanded) * 100);
  date = new Date(currentTime).toISOString().split('T')[0];
  
////////////////////////////////// PRICES ANALOGY /////////////////////////////////////
  function getDatesAndPrices(){
    for (var i = 0; i < priceHistory.length; i += 2) {
    allDates.push(priceHistory[i]);
    priceHistory[i+1] && allPrices.push(priceHistory[i + 1]);
  };
  };
  getDatesAndPrices();

  //trasfer keepa time to proper milisecond and then transfer the milisecond to dates//

 miliSec = allDates.map(x => (x + addTime)*multiplyTime);
 epocTimeConvertor = miliSec.map(x => new Date(x).toISOString().split('T')[0]);

 //Get Last 30 days AVG price//
  var d = new Date();
  var o = d.setDate(d.getDate()-30);
  var c = new Date(o).toISOString().split('T')[0];

  var lastThirtyDays = epocTimeConvertor.filter(function(day){
  return day > c
  });

  var leny = lastThirtyDays.length;

  var pricesThirtyDays = allPrices.slice(Math.max(allPrices.length - Number(leny), 0));
  var avgPriceThirtyDays = pricesThirtyDays.reduce((a, b) => a + b, 0)/Number(leny);
   usdPriceThirdydays = Math.round(Number(avgPriceThirtyDays) / 100);

   //Get Last 30 days AVG profit//
   profitThirty = Math.round(Number(usdPriceThirdydays) - Number(costLanded));
  //Get Last 30 days AVG ROI//
   roiThirty = Math.round(Number(profitThirty) / Number(costLanded) * 100);
  
   //Get Last 60 days AVG price//
   var p = new Date();
   var m = p.setDate(p.getDate()-60);
   var k = new Date(m).toISOString().split('T')[0];
 
   var lastSixtyDays = epocTimeConvertor.filter(function(day){
   return day > k
   });
 
   var lenyTwo = lastSixtyDays.length;
 
   var pricesSixtyDays = allPrices.slice(Math.max(allPrices.length - Number(lenyTwo), 0));
   var avgPriceSixtyDays = pricesSixtyDays.reduce((a, b) => a + b, 0)/Number(lenyTwo);
    usdPriceSixydays = Math.round(Number(avgPriceSixtyDays) / 100);

   //Get Last 30 days AVG profit//
   profitSixty = Math.round(Number(usdPriceSixydays) - Number(costLanded));
   //Get Last 30 days AVG ROI//
   roiSixty = Math.round(Number(profitSixty) / Number(costLanded) * 100);

   //////////////////////////////////END PRICES ANALOGY /////////////////////////////////////
   
   ////////////////////////////////// BSR ANALOGY /////////////////////////////////////

   function getBsrDatesAndRanks(){
    for (var i = 0; i < bsrHistory.length; i += 2) {
    allBsrDates.push(bsrHistory[i]);
    bsrHistory[i+1] && allBsrRanks.push(bsrHistory[i + 1]);
  };
  };
  getBsrDatesAndRanks();

  miliSecBsr = allBsrDates.map(x => (x + addTime)*multiplyTime);
  epocTimeBsrConvertor = miliSecBsr.map(x => new Date(x).toISOString().split('T')[0]);

    // AVG BSR last 30 Days // 
  var lastThirtyDaysBsr = epocTimeBsrConvertor.filter(function(day){
    return day > c
    });

  var lenyBsr = lastThirtyDaysBsr.length;

  var bsrRanksThirtyDays = allBsrRanks.slice(Math.max(allBsrRanks.length - Number(lenyBsr), 0));
  avgBsrRankThirtyDays = Math.round(bsrRanksThirtyDays.reduce((a, b) => a + b, 0)/Number(lenyBsr));
   
  // AVG BSR last 60 Days //

  var lastSixtyDaysBsr = epocTimeBsrConvertor.filter(function(day){
    return day > k
    });

  var lenyBsrTwo = lastSixtyDaysBsr.length;

  var bsrRanksSixtyDays = allBsrRanks.slice(Math.max(allBsrRanks.length - Number(lenyBsrTwo), 0));
  avgBsrRankSixtyDays = Math.round(bsrRanksSixtyDays.reduce((a, b) => a + b, 0)/Number(lenyBsrTwo));

  ////////////////////////////////// END BSR ANALOGY /////////////////////////////////////

   //console.log(avgBsrRankSixtyDays);

  const newAsin = new Asin({
    asinId:asin,
    parentAsinId:parentAsin,
    categoryId:category,
    fbaFeesId:fbaFee,
    buyBoxpriceId:curentPrice,
    bsrId:currentBsr,
    avgPriceTd:usdPriceThirdydays,
    avgProfitTd:profitThirty,
    avgRoiTd:roiThirty,
    bsrIdTd:avgBsrRankThirtyDays,
    avgPriceSd:usdPriceSixydays,
    avgProfitSd:profitSixty,
    avgRoiSd:roiSixty,
    bsrIdSd:avgBsrRankSixtyDays,
    image:img1 + img2,
    dateRequest:date,
    amzUrl:prodUrl+asin,
    prodProfit:curentProfit,
    prodRoi:curentRoi,
    landedCost:costLanded,
    prodReferalFee:referalFee,
    supplierCost:cogs
  });

  newAsin.save(function(err){
    if(!err){
      res.redirect("/system");
    }else{
      console.log(err);
    }
  });
  // res.write("<h1>The Asin is " + asin + "</h1>");
  });

  });
  

});

app.post("/delete",function(req, res){
  const deleteItemId = req.body.deletedItem;
  Asin.findByIdAndRemove(deleteItemId,function(err){
    if(!err){
      console.log("successfully deleted Asin");
      res.redirect("/system");
    }
  })
});


app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/")
});

app.post("/register", function (req,res){

  User.register({username:req.body.username}, req.body.password, function(err,user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/system");
      });
    }
  });

});

app.post("/login",function(req,res){
  const user = new User({
    username:req.body.username,
    password:req.body.password
  });

  req.login(user,function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/system");
    });
  }
  });
});

  app.listen(3000, function() {
  console.log("server is running on port 3000");
});
