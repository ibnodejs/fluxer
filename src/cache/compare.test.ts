import "mocha";

import { getWeekends, minimumMarketData } from "./compare";

import { expect } from "chai";

const startDate = new Date("2022-10-27");

describe("Compare", () => {
  // Crypto
  it("should compare crypto market for two day", () => {
    // for 2 days it has to be more than 360 + 360
    const isEnough = minimumMarketData({
      crypto: true,
      start: startDate,
      end: new Date("2022-10-29"),
    });
    console.log("crypto market data minimum", isEnough);

    expect(isEnough > 2000).to.be.true;
  });

  // Stocks
  it("should compare market for two day", () => {
    // for 2 days it has to be more than 360 + 360
    const isEnough = minimumMarketData({
      start: startDate,
      end: new Date("2022-10-29"),
    });
    expect(isEnough > 1400).to.be.true;
  });

  it("should compare market for one day without end data", () => {
    const isEnough = minimumMarketData({
      start: startDate,
    });
    expect(isEnough > 400).to.be.true;
  });

  it("should compare market for two day with less returned", () => {
    // for 1 days it has to be more than 500
    const returnedMin = minimumMarketData({
      start: startDate,
      end: new Date("2022-10-28"),
    });
    console.log("market data minimum", returnedMin);

    expect(returnedMin > 500).to.be.true;
  });

  it("should compare market for two day when there's a weekend", () => {
    // for 5 days it has to btw 2160 when there's a weekend
    const returnedMin = minimumMarketData({
      start: startDate,
      end: new Date("2022-11-01"),
    });
    console.log("market data minimum", returnedMin);

    expect(returnedMin <= 2160).to.be.true;
  });

  it("it should get weekends ", () => {
    const weekends = getWeekends(new Date("2022-10-27"), 5);
    console.log("weekends are", weekends);

    expect(weekends).to.be.equal(2);
  });
});
