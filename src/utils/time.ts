// add a number of days to a date, something in moment or just pure js
export const addDayToDate = (date: Date, days: number): Date => {
  const startingDate = new Date(date);
  startingDate.setDate(startingDate.getDate() + days);
  return startingDate;
};
