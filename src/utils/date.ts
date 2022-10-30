/**
 * Compare 2 days array,
 * using toISOString
 * @param monthA
 * @param monthTarget
 * @returns
 */
export const getUniqueDays = (monthA: Date[], monthTarget: Date[]): Date[] => {
  let targetMonthMissing: Date[] = [];
  const targetMonthIso = monthTarget.map((d) => d.toISOString());

  monthA.forEach((dayFromA) => {
    if (!targetMonthIso.includes(dayFromA.toISOString())) {
      targetMonthMissing.push(dayFromA);
    }
  });

  return targetMonthMissing;
};

interface ChunksRange {
  start: Date;
  end: Date;
}

/**
 * Chunkify start, end, using minutesDiff
 */
export const getChunkRanges = (
  start: Date,
  end: Date,
  minutesDiff = 1000
): ChunksRange[] => {
  const startDate = new Date(start);
  const now = new Date(end);

  const ranges: ChunksRange[] = [];

  for (
    let d = startDate;
    d <= now;
    d.setMinutes(d.getMinutes() + minutesDiff)
  ) {

    const start = new Date(d);
    const cloneD = new Date(d);
    const end = new Date(cloneD.setMinutes(d.getMinutes() + minutesDiff));

    ranges.push({
      start,
      end,
    });
  }

  return ranges;
};
