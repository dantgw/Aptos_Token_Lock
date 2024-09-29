// ... existing imports ...
import { microsecondsToDate } from "@/lib/utils";
import { DataPoint } from "@/types/types";
import { GetTokenLocksByTokenAddressResponse } from "@/view-functions/getTokenLocksByTokenAddress";
export function transformTokenLocksToGraphData(tokenLocks: GetTokenLocksByTokenAddressResponse): DataPoint[] {
  if (!tokenLocks || tokenLocks.length === 0) return [];


  const { earliestCliffDate, latestEndDate } = findDateBoundaries(tokenLocks);
  const dataPoints = new Map<number, Omit<DataPoint, 'x'>>();

  const currentDate = new Date(earliestCliffDate);

  latestEndDate.setDate(latestEndDate.getDate() + 1)

  while (currentDate <= latestEndDate) {
    tokenLocks.forEach((lock, index) => {
      const cliffDate = microsecondsToDate(lock.cliff_timestamp);

      const vestingEndDate = microsecondsToDate(Number(lock.cliff_timestamp) + Number(lock.vesting_duration));
      const initialAmount = Number(lock.initial_amount);
      const periodicityInMs = Number(lock.periodicity)
      if (currentDate <= cliffDate) {
        addOrUpdateDataPoint(dataPoints, currentDate, 0, index);
      } else if (currentDate < vestingEndDate) {
        addOrUpdateDataPoint(dataPoints, currentDate, (currentDate.getTime() - cliffDate.getTime()) / (vestingEndDate.getTime() - cliffDate.getTime()) * initialAmount, index);
      } else {
        addOrUpdateDataPoint(dataPoints, currentDate, initialAmount, index);
      }
    })
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  console.log('dataPoints', dataPoints)

  return Array.from(dataPoints.entries())
    .sort(([dateA], [dateB]) => dateA - dateB)
    .map(([date, values]) => ({ x: new Date(date), ...values }));
}


function addOrUpdateDataPoint(
  dataPoints: Map<number, Omit<DataPoint, 'x'>>,
  date: Date,
  amount: number,
  lockIndex: number
): void {
  const key = date.getTime();
  if (!dataPoints.has(key)) {
    const point: Omit<DataPoint, 'x'> = { [`${lockIndex + 1}`]: amount };
    dataPoints.set(key, point);
  } else {
    const existingPoint = dataPoints.get(key)!;
    existingPoint[`y${lockIndex + 1}`] = amount;
  }
}





function findDateBoundaries(tokenLocks: GetTokenLocksByTokenAddressResponse): { earliestCliffDate: Date; latestEndDate: Date } {
  let earliestCliffDate = new Date(8640000000000000); // Max date
  let latestEndDate = new Date(-8640000000000000); // Min date

  tokenLocks.forEach(lock => {
    const cliffDate = microsecondsToDate(lock.cliff_timestamp);
    const vestingEndDate = microsecondsToDate(Number(lock.cliff_timestamp) + Number(lock.vesting_duration));

    earliestCliffDate = new Date(Math.min(earliestCliffDate.getTime(), cliffDate.getTime()));
    latestEndDate = new Date(Math.max(latestEndDate.getTime(), vestingEndDate.getTime()));
  });

  return { earliestCliffDate, latestEndDate };
}