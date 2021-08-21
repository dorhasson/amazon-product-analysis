const pupUrl = 'https://www.amazon.com/dp/' + req.body.asinIdInput;

async function configureBrowser(){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(pupUrl , {waitUntil: 'load', timeout: 0});
  return page;
}

async function checkPrice(page){
  await page.reload();
  let html = await page.evaluate(()=> document.body.innerHTML);

  $('.a-touch-link a-box olp-touch-link',html).each(function(){ 
    let isAmazonSeller = $(this).text();

    if(isAmazonSeller="Amazon.comAmazon.comAmazon.comAmazon.com"){
      console.log("Yes"); 
    }else{
      console.log("No");
    } 
  });
}


async function monitor(){
  let page = await configureBrowser();
  await checkPrice(page);
}

monitor();