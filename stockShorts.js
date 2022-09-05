// https://github.com/kamukrass/Bitburner/blob/develop/stock-trader.js
// file: stock-trader.js

// requires 4s Market Data TIX API Access

// defines if stocks can be shorted (see BitNode 8)
const shortAvailable = ns.args = 0 ? true : false;

const commission = 100000;
const FORECAST_THRESH_BUY = 0.57;
const FORECAST_THRESH_SELL = 0.47;
const PROFIT_THRESH_SELL = - 0.015;
const PROFIT_THRESH_SELL_MAX = - 0.03;
const MONEY_THRESH = 10 * 1000000
const BUY_AFTER_SOLD_CALMDOWN_CYCLES = 6

export async function main(ns) {
  ns.disableLog("ALL");
  ns.tail();

  while (true) {
    tendStocks(ns);
    await ns.sleep(5 * 1000);
  }
}

function tendStocks(ns) {
  ns.print("");
  var stocks = getAllStocks(ns);

  stocks.sort((a, b) => b.profitPotential - a.profitPotential);

  var longStocks = new Set();
  var shortStocks = new Set();
  let sellWaitingCalmdown = new Map()
  var overallValue = 0;

  for (const stock of stocks) {
    if (stock.longShares > 0) {
      if (
        (
          stock.forecast < FORECAST_THRESH_SELL
          || (stock.forecast < 0.55 && stock.profit / stock.cost < PROFIT_THRESH_SELL)
          || stock.profit / stock.cost < PROFIT_THRESH_SELL_MAX
        ) && stock.bidPrice > 100
      ) {
        // sell due to possibility to loss profits
        const salePrice = ns.stock.sellStock(stock.sym, stock.longShares);
        sellWaitingCalmdown.set(stock.sym + "_long", BUY_AFTER_SOLD_CALMDOWN_CYCLES)
        const saleTotal = salePrice * stock.longShares;
        const saleCost = stock.longPrice * stock.longShares;
        const saleProfit = saleTotal - saleCost - 2 * commission;
        stock.shares = 0;
        shortStocks.add(stock.sym);
        ns.print(`WARN ${ stock.summary } SOLD for ${ ns.nFormat(saleProfit, "$0.0a") } profit`);
      }
      else {
        // create list of long shares to continue to have
        longStocks.add(stock.sym);
        sellWaitingCalmdown.set(stock.sym + "_long", sellWaitingCalmdown.get(stock.sym + "_long") - 1)
        ns.print(`INFO ${ stock.summary } LONG ${ ns.nFormat(stock.cost + stock.profit, "$0.0a") }`);
        overallValue += (stock.cost + stock.profit);
      }
    } else if (stock.shortShares > 0) { // cannot have short and long both on the same stock (there is no added value)
      if (
        stock.forecast > 1 - FORECAST_THRESH_SELL
        || (stock.forecast < 0.55 && stock.profit / stock.cost > 1 - PROFIT_THRESH_SELL)
        || stock.profit / stock.cost > 1 - PROFIT_THRESH_SELL_MAX
      ) {
        // sell due to possibility to loss profits
        const salePrice = ns.stock.sellShort(stock.sym, stock.shortShares);
        sellWaitingCalmdown.set(stock.sym + "_short", BUY_AFTER_SOLD_CALMDOWN_CYCLES)
        const saleTotal = salePrice * stock.shortShares;
        const saleCost = stock.shortPrice * stock.shortShares;
        const saleProfit = saleCost - saleTotal - 2 * commission;
        stock.shares = 0;
        longStocks.add(stock.sym);
        ns.print(`WARN ${ stock.summary } SHORT SOLD for ${ ns.nFormat(saleProfit, "$0.0a") } profit`);
      }
      else {
        // create list of short shares to continue to have
        shortStocks.add(stock.sym);
        sellWaitingCalmdown.set(stock.sym + "_short", sellWaitingCalmdown.get(stock.sym + "_short") - 1)
        ns.print(`INFO ${ stock.summary } SHORT ${ ns.nFormat(stock.cost + stock.profit, "$0.0a") }`);
        overallValue += (stock.cost + stock.profit);
      }
    } else if (stock.askPrice > 10 ** 6 && stock.longShares === 0) { // if the askPrice is huge, there is a good place to make short profit from hack (if we do not have any shares long or short)
      shortStocks.add(stock.sym);
    }
  }

  for (const stock of stocks) {
    var money = ns.getServerMoneyAvailable("home") - MONEY_THRESH;
    //ns.print(`INFO ${stock.summary}`);
    if (
      // sellWaitingCalmdown.get(stock.sym + "_long") < 0 &&
      (stock.forecast > FORECAST_THRESH_BUY || stock.askPrice < 1) &&
      stock.shortShares === 0 &&
      stock.longShares < stock.maxShares
    ) {
      longStocks.add(stock.sym);
      //ns.print(`INFO ${stock.summary}`);
      if (money > 500 * commission) {
        const sharesToBuy = Math.min(stock.maxShares, Math.floor((money - commission) / stock.askPrice));
        if (ns.stock.buyStock(stock.sym, sharesToBuy - stock.longShares) > 0) {
          ns.print(`WARN ${ stock.summary } LONG BOUGHT ${ ns.nFormat(sharesToBuy, "0.0a") } shares for ${ ns.nFormat(sharesToBuy * stock.bidPrice, "$0.0a") }`);
        }
      }
    } else if (
      // sellWaitingCalmdown.get(stock.sym + "_short") < 0 &&
      stock.forecast < 1 - FORECAST_THRESH_BUY &&
      stock.longShares === 0 &&
      stock.shortShares < stock.maxShares &&
      shortAvailable
    ) {
      shortStocks.add(stock.sym);
      //ns.print(`INFO ${stock.summary}`);
      if (money > 500 * commission) {
        const sharesToBuy = Math.min(stock.maxShares, Math.floor((money - commission) / stock.bidPrice));
        if (ns.stock.buyShort(stock.sym, sharesToBuy - stock.shortShares) > 0) {
          ns.print(`WARN ${ stock.summary } SHORT BOUGHT ${ ns.nFormat(sharesToBuy, "0.0a") } shares for ${ ns.nFormat(sharesToBuy * stock.bidPrice, "$0.0a") }`);
        }
      }
    }
  }
  ns.print("Stock value: " + ns.nFormat(overallValue, "$0.0a"));

  // send stock market manipulation orders to hack manager
  var growStockPort = ns.getPortHandle(1); // port 1 is grow
  var hackStockPort = ns.getPortHandle(2); // port 2 is hack
  if (growStockPort.empty()) {
    // only write to ports if empty
    for (const sym of longStocks) {
      // ns.print("INFO sent grow signal for " + sym);
      growStockPort.write(getSymServer(sym));
    }
  }
  if (hackStockPort.empty()) {
    for (const sym of shortStocks) {
      // ns.print("INFO sent hack signal for " + sym);
      hackStockPort.write(getSymServer(sym));
    }
  }
}

export function getAllStocks(ns) {
  // make a lookup table of all stocks and all their properties
  const stockSymbols = ns.stock.getSymbols();
  const stocks = [];
  for (const sym of stockSymbols) {

    const pos = ns.stock.getPosition(sym);
    const stock = {
      sym: sym,
      longShares: pos[0],
      longPrice: pos[1],
      shortShares: pos[2],
      shortPrice: pos[3],
      forecast: ns.stock.getForecast(sym),
      volatility: ns.stock.getVolatility(sym),
      askPrice: ns.stock.getAskPrice(sym),
      bidPrice: ns.stock.getBidPrice(sym),
      maxShares: ns.stock.getMaxShares(sym),
    };

    var longProfit = stock.longShares * (stock.bidPrice - stock.longPrice) - 2 * commission;
    var shortProfit = stock.shortShares * (stock.shortPrice - stock.askPrice) - 2 * commission;
    stock.profit = longProfit + shortProfit;
    stock.cost = (stock.longShares * stock.longPrice) + (stock.shortShares * stock.shortPrice)

    // profit potential as chance for profit * effect of profit
    var profitChance = 2 * Math.abs(stock.forecast - 0.5);
    var profitPotential = profitChance * (stock.volatility);
    stock.profitPotential = profitPotential;

    stock.summary = `${ stock.sym }: F${ stock.forecast.toFixed(3) } ± V${ stock.volatility.toFixed(3) }${ stock.cost != 0 ? " " + ns.nFormat(100 * stock.profit / stock.cost, "0.00") + "%" : "" }`;
    stocks.push(stock);
  }
  return stocks;
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
