const getDatesAndPrices = require('./price_analogy/all_dates_and_prices');
const convertKeepaTimeForPrice = require('./price_analogy/price_epoctime_to_date');
const getAvgPrice30Days = require('./price_analogy/30_days_price_analogy/avg_price_last_30');
const avgProfitThirtyDays = require('./price_analogy/30_days_price_analogy/avg_profit_last_30');
const getAvgRoiThirDays = require('./price_analogy/30_days_price_analogy/avg_roi_last_30');
const getAvgPriceSixtyDays = require('./price_analogy/60_days_price_analogy/avg_price_60');
const getAvgProfitSixtyDays = require('./price_analogy/60_days_price_analogy/avg_profit_60');
const getAvgRoiSixtyDays = require('./price_analogy/60_days_price_analogy/avg_roi_60');
const getBsrDatesAndRanks = require('./bsr_analogy/all_dates_and_bsr');
const convertKeepaTimeForBsr = require('./bsr_analogy/bsr_epoctime_to_date');
const getAvgBsrLastThirtyDays = require('./bsr_analogy/30_days_bsr_analogy/avg_bsr_last_30');
const getAvgBsrLastSixtyDays = require('./bsr_analogy/60_days_bsr_analogy/avg_bsr_last_60');

function pullAllData(){
////////////////////////////////// PRICES ANALOGY /////////////////////////////////////

      // Saparate prices and dates to two differents arrays //

      getDatesAndPrices();

      //trasfer keepa time to proper milisecond and then transfer the milisecond to dates//

      convertKeepaTimeForPrice();

      //Get Last 30 days AVG price//

      getAvgPrice30Days();

      //Get Last 30 days AVG profit//

      avgProfitThirtyDays();

      //Get Last 30 days AVG ROI//

      getAvgRoiThirDays();

      //Get Last 60 days AVG price//

      getAvgPriceSixtyDays();

      //Get Last 60 days AVG profit//

      getAvgProfitSixtyDays();

      //Get Last 60 days AVG ROI//

      getAvgRoiSixtyDays();

      //////////////////////////////////END PRICES ANALOGY ////////////////////////////////////


      ////////////////////////////////// BSR ANALOGY ////////////////////////////////////////

      // Saparate BSR and dates to two differents arrays //

      getBsrDatesAndRanks();

      //trasfer keepa time to proper milisecond and then transfer the milisecond to dates //

      convertKeepaTimeForBsr();

      // AVG BSR last 30 Days // 

      getAvgBsrLastThirtyDays();

      // AVG BSR last 60 Days //

      getAvgBsrLastSixtyDays();

      ////////////////////////////////// END BSR ANALOGY /////////////////////////////////////
    }

    module.exports = pullAllData;