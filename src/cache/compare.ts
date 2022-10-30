import { addDayToDate, isWeekend } from "../utils/time";
import moment, { Moment } from "moment";
/**
 * Compare demanded market data and returned data
 */

// I'll assume a symbols has a minimum of these ticks in a day
const minMarketDataCount = 720;

interface IsEnough {
  crypto?: boolean;
  start: Date;
  end?: Date;
}

export const minimumMarketData = (args: IsEnough): number => {
  const { start, end, crypto = false } = args;
  const dayLimitStocks = 720;
  const dayLimitCrypto = 1440;

  const dayLimit = crypto ? dayLimitCrypto : dayLimitStocks;

  const endingDate = end ? end : addDayToDate(start, 1);
  const startDate = moment(new Date(start));
  const endDate = moment(new Date(endingDate));
  const diff = endDate.diff(startDate, "d") || 1;

  let minimumForRequestedDays = diff * dayLimit;
  if (!crypto) {
    const weekendsBetweenDays = getWeekends(start, diff);
    const daysToRemove = weekendsBetweenDays * dayLimit;
    minimumForRequestedDays = minimumForRequestedDays - daysToRemove;
  }

  return minimumForRequestedDays;
};

export const getWeekends = (start: Date, days: number): number => {
  let weekends = 0;
  let date = new Date(start);

  for (let i = 0; i < days; i++) {
    date = addDayToDate(date, 1);
    if (isWeekend(date)) {
      weekends += 1;
    }
  }

  return weekends;
};
