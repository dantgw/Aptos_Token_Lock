import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
// Internal utils
import {
  APT_DECIMALS,
  convertAmountFromHumanReadableToOnChain,
  convertAmountFromOnChainToHumanReadable,
} from "@/utils/helpers";
import { MODULE_ADDRESS } from "@/constants";

export type CreateTokenLockArguments = {
  tokenAddress: string; // The token address
  amount: number; // The amount of the tokens
  cliffTimestamp: number; // The date of the cliff
  vestingDuration: number; // How often the tokens are vested for
  periodicity: number; // How often tokens can be claimed
  claimantAddress: string; // Address of the user to claim

};

export const createTokenLock = (args: CreateTokenLockArguments): InputTransactionData => {
  const { tokenAddress, amount, cliffTimestamp, vestingDuration, periodicity, claimantAddress } =
    args;
  return {
    data: {
      function: `${MODULE_ADDRESS}::token_lock::add_token_lock`,
      typeArguments: [],
      functionArguments: [
        tokenAddress, amount, cliffTimestamp, vestingDuration, periodicity, claimantAddress
      ],
    },
  };
};
