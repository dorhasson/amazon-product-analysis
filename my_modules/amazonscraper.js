

  //Scraping Monde On//

//   const pupUrl = 'https://www.amazon.com/dp/' + req.body.asinIdInput;

// async function configureBrowser(){
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(pupUrl , {waitUntil: 'load', timeout: 0});
//   return page;
// }

// async function checkPrice(page){
//   await page.reload();
//   let html = await page.evaluate(()=> document.body.innerHTML);

//   $('.tabular-buybox-column',html).each(function(){ 
//     var isAmazonSelling = $(this).text();

//     if(isAmazonSelling="Amazon.comAmazon.comAmazon.comAmazon.com"){
//       product.isAmazonSeller="Yes"; 
//     }else{
//       product.isAmazonSeller="No"; 
//     }; 
//     console.log(product.isAmazonSeller);
//   });
// }


// async function monitor(){
//   let page = await configureBrowser();
//   await checkPrice(page);
// }

// monitor();
  // End Scraping Mode//

describe ('Scraping Mode' , () => {
  let browser;
  let page;
  let pupUrl = 'https://www.amazon.com/dp/' + req.body.asinIdInput;

  before(async function() {
    browser = await puppeteer.launch({
      headless:true,
      slowMo:0,
      devtools:false
    });
    page = await browser.newPage();
    await page.setDefaultTimeout(10000);
    await page.setDefaultNavigationTimeout(20000);
  });
  
  after(async function(){
    await browser.close();
  });

  it('Get Number of sellers', async function(){
    await page.goto(pupUrl);
    await page.waitForSelector('.olp-link-widget');
    await page.click('.olp-link-widget');
    await page.waitForSelector('#aod-filter-string');
    await page.click('#aod-filter-string');
    await page.waitForSelector('#primeEligible');
    await page.click('#primeEligible');
    let sellernum = await page.waitForSelector('#aod-filter-offer-count-string');

    console.log(sellernum);
  });

})