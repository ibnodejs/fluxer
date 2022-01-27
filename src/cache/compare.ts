import { addDayToDate } from "../utils/time";
import moment from "moment";
/**
 * Compare demanded market data and returned data
 */

// I'll assume a symbols has a minimum of these ticks in a day
const MarketDataCount = 360;

interface IsEnough {
  returnedCount: number;
  start: Date;
  end?: Date;
  limit?: number;
}

export const isMarketDataCountEnough = (args: IsEnough): boolean => {
  const { returnedCount, start, end, limit = MarketDataCount } = args;
  // find the number of days. from start and end
  // multiply by minimum per day
  // compare if returnedCount is equal or greater.

  const endingDate = end ? end : addDayToDate(start, 1);

  const startDate = moment(new Date(start));
  const endDate = moment(new Date(endingDate));
  const diff = endDate.diff(startDate, "d");

  const minimumForRequestedDays = diff * limit;

  return returnedCount >= minimumForRequestedDays;
};
