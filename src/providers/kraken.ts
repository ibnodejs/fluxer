import { GetBars, Provider } from ".";
import { KRAKEN_KEY, KRAKEN_SECRET } from "../config";

import { Kraken } from "node-kraken-api";
import _get from "lodash/get";
import { log } from "roadman";

// start client from here
// TODO match types
export class KrakenProvider implements Provider {
  provider: Kraken;
  constructor() {
    this.provider = new Kraken({
      key: KRAKEN_KEY,
      secret: KRAKEN_SECRET
    });
  }
  async getBars(args: GetBars): Promise<any[]> {
    const { start, end, symbol } = args;

    let krakensymbol = args.symbol;

    if (symbol.startsWith("X")) {
      krakensymbol = krakensymbol.replace("X:", "");
    }

    log(`KrakenProvider: ${symbol} -> start: ${start} - end: ${end}`);

    let bars = [];

    let last = start.getTime();
    const endTime = end.getTime();

    const delay = (time: number, value = "resolve") => {
      return new Promise((resolve) => {
        setTimeout(() => { resolve(value) }, time)
      });
    }

    try {

      while (last <= endTime) {

        log("last", last, krakensymbol)
        // get more data 
        const returnedBars = await this.provider.trades({
          since: last / 1000 + "",
          pair: krakensymbol,
        });

        const returnedBarsKeys = Object.keys(returnedBars);

        const pairData = returnedBars[returnedBarsKeys[0]] || [];
        log("pairData", pairData.length)

        bars.push(...pairData);

        const lastBar = pairData[pairData.length - 1];
        const newlast = Math.round(+lastBar[2] * 1000);

        if (newlast === last) {
          // break loop
          last = endTime + 1;
        } else {
          last = newlast;
        }

        log("newlast", last)

        await delay(800);
      }

    }
    catch (err) {
      console.error(err);
    } finally {

      log(`KrakenProvider: bars: ${bars.length}`);

      /**
       * TRADES
       * [<price>, <volume>, <time>, <buy/sell>, <market/limit>, <miscellaneous>, <trade_id>]
       *  const [price, volume, date, action, market,mis, trade_id] = d;
       * OHLC
       * const [date, open, high, low, close, vwap, volume, count] = pairData;
       * [int <time>, string <open>, string <high>, string <low>, string <close>, string <vwap>, string <volume>, int <count>]
       *  const [date, open, high, low, close, vwap, volume, count] = d;
       'MATIC/USD': [
      [
        1669528800, time
        '0.8536', o
        '0.8566',
        '0.8536',
        '0.8555',
        '0.8549',
        '13557.89138103',
        2
       */

      const marketdata = (bars || []).map((d) => {
        // const [date, open, high, low, close, vwap, volume, count] = d;
        const [price, volume, date, action, market, mis, trade_id] = d;
        const high = 0;
        const low = 0;
        const open = 0;
        return {
          close: +price,
          open: open,
          date: new Date(+date * 1000),
          volume: +volume,
          high: high,
          low: low,
          symbol,
        }
      });

      // log("first", marketdata[0]?.date + " ")
      // log("last", marketdata[marketdata.length - 1]?.date + " ")

      log(`KrakenProvider: ${symbol} -> total: ${marketdata.length}`);

      return marketdata;
    }




  }
}
