import { GetBars, Provider } from ".";

import { Kraken } from "node-kraken-api";
import _get from "lodash/get";
import { log } from "roadman";

export const KRAKEN_KEY = _get(
  process.env,
  "KRAKEN_KEY",
  ""
);

export const KRAKEN_SECRET = _get(
  process.env,
  "KRAKEN_SECRET",
  ""
);

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

    log(`KrakenProvider: ${symbol} -> start: ${start} - end: ${end}`);

    let bars = [];

    let last = start.getTime();
    const endTime = end.getTime();

    // TODO
    // map start and end

    while (last <= endTime) {
      console.log("last", last)
      // get more data 
      const returnedBars = await this.provider.trades({
        since: last / 1000 + "",
        pair: symbol,
      });

      const pairData = returnedBars[symbol];
      bars.push(...pairData);

      const lastBar = pairData[pairData.length - 1];
      last = Math.round(+lastBar[2] * 1000);

      console.log("new last", last)
    }

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
      return {
        close: +price,
        open: +price,
        date: new Date(+date * 1000),
        volume: +volume,
        // high: +high,
        // low: +low,
        symbol,
      }
    });

    console.log("first", marketdata.shift()?.date + " ")
    console.log("last", marketdata.pop()?.date + " ")

    log(`KrakenProvider: ${symbol} -> total: ${marketdata.length}`);

    return marketdata;
  }
}