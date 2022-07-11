import "mocha";

import { PORT, appName } from "./config";

import chalk from "chalk";
import { runApp } from "./app";
import supertest from "supertest";

// Start server
runApp();
before((done) => setTimeout(done, 1500)); // timeout for server to start

const request = supertest(`http://127.0.0.1:${PORT}`);

const currentDate = new Date("05-07-2020");

const object = {
  symbol: "TESTSYMBOL",
  open: 2,
  high: 3,
  low: 1,
  close: 2,
  volume: 100,
  date: currentDate,
};

const arr = [object];

describe(`Server ${appName}`, () => {
  it("on / route should respond with json", function (done) {
    request
      .get("/fluxer")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  /**
   * /insert
   */
  it("should insert object market data", function (done) {
    request
      .post("/fluxer/v1/insert")
      .send(object)
      .set("Accept", "application/json")
      //   .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("should insert array market data", function (done) {
    request
      .post("/fluxer/v1/insert")
      .send(arr)
      .set("Accept", "application/json")
      //   .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("should not insert empty array market data", function (done) {
    request
      .post("/fluxer/v1/insert")
      .send([])
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("should not insert empty market data item", function (done) {
    request
      .post("/fluxer/v1/insert")
      .send({})
      .set("Accept", "application/json")
      .expect(401, done);
  });

  // query
  it("should query market data item", function (done) {
    const cur = new Date(currentDate);
    request
      .get("/fluxer/v1/query")
      .query({
        symbol: object.symbol,
        start: new Date(cur.setDate(cur.getDate() - 1)).toISOString(),
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect((res) => res.body.length)
      .expect(200, done);
  });

  it("should query market data items with end", function (done) {
    const cur = new Date(currentDate);
    request
      .get("/fluxer/v1/query")
      .query({
        symbol: object.symbol,
        start: new Date(cur.setDate(cur.getDate() - 1)),
        end: new Date(currentDate),
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect((res) => res.body.length)
      .expect(200, done);
  });
});
