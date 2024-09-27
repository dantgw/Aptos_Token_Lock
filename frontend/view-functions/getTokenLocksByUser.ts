import { AccountAddress } from "@aptos-labs/ts-sdk";
import { aptosClient } from "@/utils/aptosClient";
import { MODULE_ADDRESS } from "@/constants";

type GetTokenLocksByUserArguments = {
  user_address: string;
};

export const getTokenLocksByUser = async ({ user_address }: GetTokenLocksByUserArguments) => {
  const tokenLocks = await aptosClient().view<[[{ inner: string }]]>({
    payload: {
      function: `${AccountAddress.from(MODULE_ADDRESS)}::token_lock::get_token_locks_by_user`,
      functionArguments: [user_address]
    },
  });
  return tokenLocks;
};
