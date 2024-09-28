import { InputTransactionData, TxnBuilderTypes } from "@aptos-labs/wallet-adapter-react";
// Internal utils
import {
  APT_DECIMALS,
  convertAmountFromHumanReadableToOnChain,
  convertAmountFromOnChainToHumanReadable,
} from "@/utils/helpers";
import { MODULE_ADDRESS } from "@/constants";
import { AccountAddress, } from "@aptos-labs/ts-sdk";
import { BCS } from "aptos"

export type ClaimTokenArguments = {
  row_id: number
};

export const claimToken = (args: ClaimTokenArguments): InputTransactionData => {
  const { row_id } = args;
  console.log(args)
  return {
    data: {
      function: `${MODULE_ADDRESS}::token_lock::claim`,
      typeArguments: [],
      functionArguments: [
        row_id
      ],
    },
  };
};
