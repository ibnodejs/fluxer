import "mocha";

import { expect } from "chai";
import { isMarketDataCountEnough } from "./compare";

describe("Compare", () => {
  it("should compare market for two day", () => {
    // for 2 days it has to be more than 360 + 360
    const isEnough = isMarketDataCountEnough({
      returnedCount: 1000,
      start: new Date(),
      end: new Date("2022-01-30"),
    });
    expect(isEnough).to.be.true;
  });

  it("should compare market for one day without end data", () => {
    const isEnough = isMarketDataCountEnough({
      returnedCount: 400,
      start: new Date(),
    });
    expect(isEnough).to.be.true;
  });

  it("should compare market for two day with less returned", () => {
    // for 2 days it has to be more than 500
    const isEnough = isMarketDataCountEnough({
      returnedCount: 500,
      start: new Date(),
      end: new Date("2022-01-30"),
    });
    expect(isEnough).to.be.false;
  });
});
