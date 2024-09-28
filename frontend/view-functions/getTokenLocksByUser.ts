import { AccountAddress } from "@aptos-labs/ts-sdk";
import { aptosClient } from "@/utils/aptosClient";
import { MODULE_ADDRESS } from "@/constants";

export type GetTokenLocksByUserArguments = {
  user_address: string;
};

export type GetTokenLocksByUserRow = {
  admin_address: string,
  balance_amount: number,
  claimant_address: string,
  cliff_timestamp: number,
  deposit_timestamp: number,
  initial_amount: number,
  last_claimed_timestamp: number,
  periodicity: number,
  token_address: string,
  vesting_duration: number
}

export type GetTokenLocksByUserResponse = GetTokenLocksByUserRow[]

export const getTokenLocksByUser = async ({ user_address }: GetTokenLocksByUserArguments) => {
  const tokenLocks = await aptosClient().view<[[GetTokenLocksByUserRow]]>({
    payload: {
      function: `${AccountAddress.from(MODULE_ADDRESS)}::token_lock::get_token_locks_by_user`,
      functionArguments: [user_address]
    },
  });
  return tokenLocks;
};
