import moment from "moment";
// circle md
// [years, symbol]

export interface CircleMdRange {
  month: Date;
  startOfMonth: Date;
  endOfMonth: Date;
}

export interface CircleMdOut {
  years: {
    [x: string]: CircleMdRange[];
  };
}

export const getRange = (date: Date): CircleMdRange => {
  const workingMonth = date;
  const startOfMonth = moment(workingMonth).startOf("month").toDate();
  const endOfMonth = moment(workingMonth).endOf("month").toDate();

  const range = {
    month: new Date(workingMonth),
    startOfMonth,
    endOfMonth,
  };

  return range;
};

/**
 * Get month ranges for each [years]
 * @param args
 * @returns
 */
export const getYearsMonthRanges = (years: Date[]): CircleMdOut => {
  const out: CircleMdOut = { years: {} };

  years.map((year: Date) => {
    const currentYear = year.getFullYear();

    // const startMonth = new Date(year.setDate(0));
    let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    while (months.length) {
      const currentMonth: number = months.shift() || 0;

      const range = getRange(new Date(year.setMonth(currentMonth)));

      if (out.years[currentYear]) {
        out.years[currentYear].push(range);
      } else {
        out.years[currentYear] = [range];
      }
    }
  });

  return out;
};
// console.log(
//   JSON.stringify(
//     circleYears({
//       years: [new Date("12-01-2019")],
//       symbol: "XXXX",
//     })
//   )
// );

/**
 * getMonthsDiffFromJan
 * get months diff months from the start of the year
 * @param year
 * @returns
 */
export const getMonthsDiffFromJan = (year: Date): number => {
  const clonedStartDate = new Date(year);
  const startDate = moment(new Date(clonedStartDate.setMonth(0)));
  const latestDate = moment(year);

  // plus this currentMonth
  return latestDate.diff(startDate, "M") + 1;
};

/**
 * Get currentMonths with {month, startOfMonth, endOfMonth}[]
 * e.g today May returns {May, Apr, Mar, Feb, Jan}
 * @returns
 */
export const getCurrentUptodateMonths = (): CircleMdRange[] => {
  const currentMonth = new Date();
  const monthsToDate = getMonthsDiffFromJan(currentMonth);
  const months = new Array(monthsToDate).fill(1);

  return months.map((month, index) => {
    const thisMonth = new Date(currentMonth.setMonth(index));
    return getRange(thisMonth);
  });
};

/**
 * Get last 3 years
 * @returns [ '12-01-2021', '12-01-2020', '12-01-2019' ]
 */
export const getThreeYearsBack = (): string[] => {
  const lastThree = new Array(4)
    .fill(1)
    .map((year, index) =>
      moment(new Date(`12-01-${new Date().getFullYear() - index}`)).format(
        "MM-DD-YYYY"
      )
    );

  // remove this year
  lastThree.shift();
  lastThree.pop(); // TODO remove
  return lastThree;
};

// console.log(getThreeYearsBack())

/**
 * Get month ranges starting from currentMonth plus 3 years back
 * @returns [CircleMdOut, years]
 */
export const circleCurrentAnd3yearsBack = (): CircleMdOut => {
  const thisYear = getCurrentUptodateMonths();

  const y3back = getThreeYearsBack();

  const otherYears = getYearsMonthRanges(y3back.map((y3) => new Date(y3)));

  const out: CircleMdOut = {
    years: {
      [`${new Date().getFullYear()}`]: thisYear,
      // ...otherYears.years,
    },
  };

  return out;
};

// console.log(JSON.stringify(circleCurrentAnd3yearsBack()));
