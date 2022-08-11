// Stock market bot for bitburner, written by steamid/Meng- https://danielyxie.github.io/bitburner/
// Runs infinitely - buys and sells stock, hopefully for a profit...
// version 1.24 - resolved bug with an edge case when calling the script with < min_cash where it would claim to buy negative stocks
const shortAvailable = true;

export async function main(ns) {
  ns.tail();
  ns.print("Stockbot is booting... WSB here we come");
  ns.disableLog('sleep');
  ns.disableLog('getServerMoneyAvailable');

  let stockSymbols = ns.stock.getSymbols(); // all symbols
  let portfolio = []; // init portfolio
  let cycle = 0;
  // ~~~~~~~You can edit these~~~~~~~~~~~~~~~~~~
  const FORECAST_THRESH = 0.65;   // Buy above this confidence level (forecast%)
  const MIN_CASH = 260 * 1000000;      // Minimum cash to keep (50m default)
  const PROFIT_THRESH = 1.1       // Value should rise above this before being considered for sell (1.1= 10% profit)
  const FC_SELL_THRESH = 0.55;    // If the above is met, forecast should stay above this or be sold.
  const STOP_LOSS = 0.4;          // If forecast drops below this, we sell stock (0.4 = 40% chance of increase, 60% chance of decrease)
  const SPEND_RATIO = 1;       // Spends up to this ratio of your total money to buy stocks (minus your min_cash set), (0.25 = 25%)
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  ns.print("Starting run - Do we own any stocks?"); //Finds and adds any stocks we already own
  for (const stock of stockSymbols) {
    let pos = ns.stock.getPosition(stock);
    if (pos[0] > 0) {
      portfolio.push({ sym: stock, value: pos[1], shares: pos[0] })
      ns.print('Detected: ' + stock + ', quant: ' + pos[0] + ' @ ' + pos[1]);
    };
  };

  if (ns.getServerMoneyAvailable('home') < MIN_CASH && portfolio.length == 0) {
    ns.print("Stockbot has no money to play with!");
    ns.print("Stockbot will nap for 10 mins while you make some money");
    await ns.sleep(600000);
  };


  ns.print("all stocks should be added, starting main loop");
  while (true) {
    for (const stock of stockSymbols) {                               // for each stock symbol
      let i = portfolio.findIndex(obj => obj.sym === stock);  // log index of symbol as i
      if (i !== -1) {  //if we already have this stock

        // send stock market manipulation orders to hack manager
        var growStockPort = ns.getPortHandle(1); // port 1 is grow
        // var hackStockPort = ns.getPortHandle(2); // port 2 is hack
        if (growStockPort.empty() /*&& hackStockPort.empty()*/) {
          // only write to ports if empty
          ns.print("INFO grow " + stock);
          growStockPort.write(getSymServer(stock));

          // for (const sym of shortStocks) {
          //   ns.print("INFO hack " + sym);
          //   hackStockPort.write(getSymServer(sym));
          // }
        }

        if (ns.stock.getAskPrice(stock) >= portfolio[i].value * PROFIT_THRESH && ns.stock.getAskPrice(stock) > 1000) { // if the price is higher than what we bought it at +PROFIT_THRESH then we consider SELL
          sellStock(stock);
        }
        else if (ns.stock.getForecast(stock) < STOP_LOSS) {             // else we check the forecast and dump the stock to stop losses
          sellStock(stock);
        }
        else if (ns.stock.getForecast(stock) >= FORECAST_THRESH && portfolio[i].shares < ns.stock.getMaxShares(stock)) {   // if the forecast is better than threshold and we own less then max shares then BUY
          buyStock(stock);
        }

      }

      else if (ns.stock.getForecast(stock) >= FORECAST_THRESH) {   // if the forecast is better than threshold and we don't own then BUY
        buyStock(stock);
      }
    } // end of for loop (iterating stockSymbols)
    cycle++;
    if (cycle % 5 === 0) { ns.print('Cycle ' + cycle + ' Complete') };
    await ns.sleep(3000);
  } // end of while true loop

  function buyStock(stock) {
    let stockPrice = ns.stock.getAskPrice(stock);                   // Get the stockprice
    let shares = stockBuyQuantCalc(stockPrice, stock);              // calculate the shares to buy using StockBuyQuantCalc

    if (ns.stock.getVolatility(stock) <= 0.05 && shares > 0) {                     // if volatility is < 5%, buy the stock
      ns.stock.buy(stock, shares);
      ns.print('Bought: ' + stock + ', quant: ' + Math.round(shares) + ' @ $' + Math.round(stockPrice));

      portfolio.push({ sym: stock, value: stockPrice, shares: shares }); //store the purchase info in portfolio
    }
  }

  function sellStock(stock) {
    let position = ns.stock.getPosition(stock);
    let forecast = ns.stock.getForecast(stock);
    let stockPrice = ns.stock.getAskPrice(stock);
    if (forecast < FC_SELL_THRESH) {
      let i = portfolio.findIndex(obj => obj.sym === stock);      //Find the stock info in the portfolio
      ns.print('SOLD: ' + stock + ', quant: ' + Math.round(portfolio[i].shares) + ' @ $' + Math.round(stockPrice) + ' - bought at $' + Math.round(portfolio[i].value));
      portfolio.splice(i, 1);                                     // Remove the stock from portfolio
      ns.stock.sell(stock, position[0]);

    }
  };

  function stockBuyQuantCalc(stockPrice, stock) { // Calculates how many shares to buy
    let playerMoney = ns.getServerMoneyAvailable('home') - MIN_CASH;
    let maxSpend = playerMoney * SPEND_RATIO;
    let calcShares = maxSpend / stockPrice;
    let maxShares = ns.stock.getMaxShares(stock);
    let portfolioIndex = portfolio.findIndex(obj => obj.sym === stock)
    let hasShares = portfolioIndex !== -1 ? portfolio[portfolioIndex].shares : 0

    if (calcShares > maxShares - hasShares) {
      return maxShares - hasShares
    }
    else {
      return calcShares
    }
  }


  function getSymServer(sym) {
    const symServer = {
      "WDS": "",
      "ECP": "ecorp",
      "MGCP": "megacorp",
      "BLD": "blade",
      "CLRK": "clarkinc",
      "OMTK": "omnitek",
      "FSIG": "4sigma",
      "KGI": "kuai-gong",
      "DCOMM": "defcomm",
      "VITA": "vitalife",
      "ICRS": "icarus",
      "UNV": "univ-energy",
      "AERO": "aerocorp",
      "SLRS": "solaris",
      "GPH": "global-pharm",
      "NVMD": "nova-med",
      "LXO": "lexo-corp",
      "RHOC": "rho-construction",
      "APHE": "alpha-ent",
      "SYSC": "syscore",
      "CTK": "comptek",
      "NTLK": "netlink",
      "OMGA": "omega-net",
      "JGN": "joesguns",
      "SGC": "sigma-cosmetics",
      "CTYS": "catalyst",
      "MDYN": "microdyne",
      "TITN": "titan-labs",
      "FLCM": "fulcrumtech",
      "STM": "stormtech",
      "HLS": "helios",
      "OMN": "omnia",
      "FNS": "foodnstuff"
    }

    return symServer[sym];

  }
}
