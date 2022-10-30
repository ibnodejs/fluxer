import "mocha";

import { PolygonProvider } from "./polygon";
import { expect } from "chai";

const polygon = new PolygonProvider();

describe("Marketdata Providers tests", () => {
  it("should get marketdata from polygon", async () => {
    const bars = await polygon.getBars({
      symbol: "AAPL",
      start: new Date("2022-10-26"),
      end: new Date("2022-10-27"),
    });

    console.log("PolygonProvider -> ", bars);

    expect(bars.length).to.be.greaterThan(300);
  });

  it("should get ticker from polygon", async () => {
    const tickerDetails = await polygon.getTicker("AAPL");

    console.log("getTicker tickerDetails -> ", tickerDetails);

    expect(tickerDetails?.symbol).to.be.equal("AAPL");
  });
});
