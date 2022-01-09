//#region SetUp Requirements
require('dotenv').config();
const {parse} = require("csv-parse");
const fs = require("fs");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const decompressResponse = require("decompress-response");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const $ = cheerio.load('<h2 class="title">Hello world</h2>');
const { log } = require('console');
const multer = require('multer');
const product = require('./my_modules/var.js');
const basicAsinSchema = require('./my_modules/database_analogy/database_schemas/asins_schemas/basic_asin_schema');
const basicUserSchema = require('./my_modules/database_analogy/database_schemas/users_schemas/basic_user_schema');
const setDataResponse = require('./my_modules/response_data');
const { delimiter } = require('path');
const uploadCsv = require('./my_modules/csv_analogy/uploadcsv');
const parseCsv = require('./my_modules/csv_analogy/loopcsv');
const pullAllData = require('./my_modules/data_functions');
const createNewAsin = require('./my_modules/database_analogy/database_schemas/asins_schemas/createNewAsin');
const loopCsv = require('./my_modules/csv_analogy/loopcsv');
const app = express();
//#endregion

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "Our little secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 3600000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

const conn = mongoose.createConnection("mongodb://localhost:27017/asinDB", { useNewUrlParser: true, useUnifiedTopology: true });
const conn2 = mongoose.createConnection("mongodb://localhost:27017/HteamUserDB", { useNewUrlParser: true, useUnifiedTopology: true });


const basicAsinDB = basicAsinSchema;

const Asin = conn.model("Asin", basicAsinDB);

module.exports = basicAsinDB;

const basicUserDB = basicUserSchema;

basicUserDB.plugin(passportLocalMongoose);

const User = conn2.model("User", basicUserDB);

module.exports = basicUserDB;

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const noData = new Asin({
  asinId: "Search for an Asin",
  parentAsinId: "",
  categoryId: "",
  fbaFeesId: 0,
  buyBoxpriceId: 0,
  bsrId: 0,
  avgPriceTd: 0,
  avgProfitTd: 0,
  avgRoiTd: 0,
  bsrIdTd: 0,
  avgPriceSd: 0,
  avgProfitSd: 0,
  avgRoiSd: 0,
  bsrIdSd: 0,
  image: "",
  dateRequest: "",
  amzUrl: "",
  prodProfit: 0,
  prodRoi: 0,
  landedCost: 0,
  prodReferalFee: 0,
  supplierCost: 0,
  AmazonIsSeller:""
});

const defaultAsin = [noData];

// Multer CSV upload setUp //

uploadCsv();

const upload = multer({ storage: product.fileStorageEngine });

// End Multer CSV setUp //


app.get("/", function (req, res) {
  res.render("home");
});

app.get("/system", function (req, res) {
  if (req.isAuthenticated()) {
    Asin.find({}, function (err, foundData) {
      if (foundData.lengh === 0) {
        Asin.insertMany(defaultAsin, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("default mode apply");
          }
        });
        res.redirect("/system");
      } else {
        res.render("system", {amzAsinData: foundData });
        //asinNumber: product.asin, imageUrl: product.img1 + product.img2, 
        //productUrl: product.prodUrl + product.asin,
      }
    });
  } else {
    res.redirect("/login");
  }
});


app.post("/system", function (req, res) {
  
  //scraping mode on//


  //scraping mode off//

  product.cogs = req.body.costIdInput;
  const query = req.body.asinIdInput;
  const apiKey = process.env.API_KEY;
  const url = "https://api.keepa.com/product?key=" + apiKey + "&domain=1&asin=" + query;

  var keepAliveAgent = new https.Agent({ keepAlive: true });
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Accept-Encoding": "gzip",
      "Connection": "Keep-Alive"
    }
  }
  options.agent = keepAliveAgent;

  https.get(url, options, function (response) {
    response = decompressResponse(response);
    console.log(res.statusCode);

    var data = '';

    response.on("data", function (chunk) {
      data += chunk;
      //console.log(data);
    });

    response.on("end", function () {
      asinData = JSON.parse(data);
      setDataResponse(asinData);

      pullAllData();

      createNewAsin();

      product.newAsin.save(function (err) {
        if (!err) {
          res.redirect("/system");
        } else {
          console.log(err);
        }
      });
     
    });

  });
 
});

app.post("/delete", function (req, res) {
  const deleteItemId = req.body.deletedItem;
  Asin.findByIdAndRemove(deleteItemId, function (err) {
    if (!err) {
      console.log("successfully deleted Asin");
      res.redirect("/system");
    }
  })
});


app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/")
});

app.post("/register", function (req, res) {

  User.register({ username: req.body.username }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/system");
      });
    }
  });

});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/system");
      });
    }
  });
});

app.post("/upload", upload.single('csv'), function (req, res) {
  delete product.cogs;
  fs.createReadStream(`./public/uploads/${req.file.filename}`)
  .pipe(
    parse({
      delimiter: ','
    })
  )
  .on('data',function(dataRow){
    product.csvData.push(dataRow);
  })
  .on('end',function(){

    const refresh = function(){
      res.redirect(req.get('referer'));
      }

    //loopCsv();
    async function firstFunction(){
     await loopCsv();
    }

    async function secondFunction(){
      await firstFunction();
      refresh();
    };

    setTimeout(() => secondFunction(), 5000); 

    // const refresh = function(){
    //   Asin.find({}, function (err, foundData) {
    //       res.render("system", {amzAsinData: foundData })
    //     })
    //   }

    // res.redirect(req.get('referer'));
  
});

});

app.listen(3000, function () {
  console.log("server is running on port 3000");
});
