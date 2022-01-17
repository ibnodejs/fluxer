import "mocha";

import { MarketDataSchema } from "./marketdata.schema";
import { expect } from "chai";
import { writeMeasurement } from "./write";

const sampleData: MarketDataSchema[] = [
  {
    symbol: "stq",
    open: 1,
    high: 2,
    low: 1,
    close: 1,
    volume: 23,
    date: new Date("2022-01-01"),
  },
  {
    symbol: "stq",
    open: 2,
    high: 3,
    low: 1,
    close: 4,
    volume: 2232,
    date: new Date("2022-01-02"),
  },
  {
    symbol: "stq",
    open: 3,
    high: 4,
    low: 2,
    close: 5,
    volume: 223234,
    date: new Date("2022-01-03"),
  },
];

describe("Fluxer V2", () => {
  it("should write some sample data", async () => {
    const samplesResults = await writeMeasurement(sampleData);
    console.log("sample results points are", sampleData);
    expect(samplesResults.length).to.be.greaterThan(1);
  });
});
