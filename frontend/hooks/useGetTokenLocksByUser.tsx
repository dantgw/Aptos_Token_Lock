import { AccountAddress, GetFungibleAssetMetadataResponse } from "@aptos-labs/ts-sdk";
import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

// Internal utils
import { aptosClient } from "@/utils/aptosClient";
import { getRegistry } from "@/view-functions/getRegistry";
import { getTokenLocksByUser, GetTokenLocksByUserResponse } from "@/view-functions/getTokenLocksByUser";
import { GetTokenLocksByUserArguments } from "@/view-functions/getTokenLocksByUser";



export function useGetTokenLocksByUser() {
  const [tokenLocks, setTokenLocks] = useState<GetTokenLocksByUserResponse>([]);
  const { account } = useWallet();
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const walletAddress = account?.address

  const fetchTokenLocksByUser = async ({ user_address }: GetTokenLocksByUserArguments) => {
    if (user_address) {
      const result = await getTokenLocksByUser({ user_address: user_address })
      if (!result) {
        return
      }
      setTokenLocks(result[0] as GetTokenLocksByUserResponse);
    }
  }

  const refetchTokenLocksByUser = () => setRefetchTrigger(prev => prev + 1);


  useEffect(() => {
    // fetch the contract registry address
    if (walletAddress) {
      fetchTokenLocksByUser({ user_address: walletAddress })
    }

  }, [walletAddress]);
  return { tokenLocks, refetchTokenLocksByUser }
}