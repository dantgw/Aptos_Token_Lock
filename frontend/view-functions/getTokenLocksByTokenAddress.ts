import { AccountAddress } from "@aptos-labs/ts-sdk";
import { aptosClient } from "@/utils/aptosClient";
import { MODULE_ADDRESS } from "@/constants";

export type GetTokenLocksByTokenAddressArguments = {
  token_address: string;
};

export type GetTokenLocksByTokenAddressRow = {
  row_id: number,
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

export type GetTokenLocksByTokenAddressResponse = GetTokenLocksByTokenAddressRow[]

export const getTokenLocksByTokenAddress = async ({ token_address }: GetTokenLocksByTokenAddressArguments) => {
  try {
    const tokenLocks = await aptosClient().view<[[GetTokenLocksByTokenAddressRow]]>({
      payload: {
        function: `${AccountAddress.from(MODULE_ADDRESS)}::token_lock::get_token_locks_by_token_address`,
        functionArguments: [token_address]
      },
    });
    return tokenLocks;
  } catch (error) {
    return []
  }
};
