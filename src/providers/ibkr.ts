import { GetBars, Provider } from ".";
import ibkr, { HistoricalData } from "@stoqey/ibkr";

import { BarSizeSetting } from "@stoqey/ib";
import isEmpty from "lodash/isEmpty";
import { writeMeasurement } from "../db/write";

// start client from here
// TODO match types
export class IbkrProvider implements Provider {
  started = false;

  async init() {
    // @ts-ignore
    await ibkr({ opt: { portfolios: false, orders: false } });
    this.started = true;
  }

  async getBars(args: GetBars): Promise<any[]> {
    if (!this.started) {
      await this.init(); // if not started
      // TODO catch when client disconnects
    }

    const { end, symbol } = args;

    const data = await HistoricalData.Instance.reqHistoricalData({
      // @ts-ignore
      endDateTime: end,
      symbol,
      whatToShow: "TRADES",
      durationStr: "1 M", // TODO calculate months between start and end
      barSizeSetting: BarSizeSetting.MINUTES_FIVE,
    });

    const marketdata = data.map((d) => ({
      close: d.close,
      open: d.open,
      date: d.date,
      volume: d.volume,
      high: d.high,
      low: d.low,
      symbol,
    }));

    // console.log("first", data[0]);

    if (!isEmpty(marketdata)) {
      // @ts-ignore
      await writeMeasurement(marketdata);
    }

    return marketdata;
  }
}
