// ... existing imports ...
import { microsecondsToDate } from "@/lib/utils";
import { DataPoint } from "@/types/types";
import { GetTokenLocksByTokenAddressResponse } from "@/view-functions/getTokenLocksByTokenAddress";
export function transformTokenLocksToGraphData(tokenLocks: GetTokenLocksByTokenAddressResponse): DataPoint[] {
  if (!tokenLocks || tokenLocks.length === 0) return [];

  const dataPoints = new Map<number, Omit<DataPoint, 'x'>>();

  tokenLocks.forEach((lock, index) => {
    const cliffDate = microsecondsToDate(lock.cliff_timestamp);

    const vestingEndDate = microsecondsToDate(Number(lock.cliff_timestamp) + Number(lock.vesting_duration));
    const initialAmount = Number(lock.initial_amount);
    const periodicityInMs = Number(lock.periodicity);

    // Add cliff point
    addOrUpdateDataPoint(dataPoints, cliffDate, 0, index);

    // Add vesting points
    // let currentDate = new Date(cliffDate);
    // while (currentDate < vestingEndDate) {
    //   currentDate = new Date(currentDate.getTime() + periodicityInMs);
    //   if (currentDate <= vestingEndDate) {
    //     const vestedAmount = calculateVestedAmount(lock, currentDate);
    //     addOrUpdateDataPoint(dataPoints, currentDate, vestedAmount, index);
    //   }
    // }

    // Ensure the final vesting point is added
    addOrUpdateDataPoint(dataPoints, vestingEndDate, initialAmount, index);
  });


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
    dataPoints.set(key, { [`y${lockIndex + 1}`]: amount });
  } else {
    const existingPoint = dataPoints.get(key)!;
    existingPoint[`y${lockIndex + 1}`] = amount;
  }
}

function calculateVestedAmount(lock: GetTokenLocksByTokenAddressResponse[number], currentDate: Date): number {
  const cliffDate = microsecondsToDate(lock.cliff_timestamp);
  const vestingEndDate = microsecondsToDate(lock.cliff_timestamp + lock.vesting_duration);
  const totalVestingTime = vestingEndDate.getTime() - cliffDate.getTime();
  const elapsedTime = currentDate.getTime() - cliffDate.getTime();
  const vestedPercentage = Math.min(elapsedTime / totalVestingTime, 1);
  return Math.floor(Number(lock.initial_amount) * vestedPercentage);
}