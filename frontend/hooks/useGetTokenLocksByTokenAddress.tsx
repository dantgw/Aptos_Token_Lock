import { useState, useEffect } from "react";

// Internal utils
import { getTokenLocksByTokenAddress, GetTokenLocksByTokenAddressArguments, GetTokenLocksByTokenAddressResponse } from "@/view-functions/getTokenLocksByTokenAddress";

export function useGetTokenLocksByTokenAddress(token_address: string) {
  const [tokenLocks, setTokenLocks] = useState<GetTokenLocksByTokenAddressResponse>([]);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fetchTokenLocksByTokenAddress = async ({ token_address }: GetTokenLocksByTokenAddressArguments) => {
    try {
      if (token_address) {


        const result = await getTokenLocksByTokenAddress({ token_address: token_address })
        if (!result) {
          setTokenLocks([]);
          return
        }
        setTokenLocks(result[0] as GetTokenLocksByTokenAddressResponse);
      }
      else {
        setTokenLocks([]);
      }
    }
    catch (error) {
      // console.log(error)
      setTokenLocks([]);
    }
  }

  const refetchTokenLocksByTokenAddress = () => setRefetchTrigger(prev => prev + 1);


  useEffect(() => {
    // fetch the contract registry address
    if (token_address) {
      fetchTokenLocksByTokenAddress({ token_address })
    }
    console.log("token_address", token_address)
  }, [token_address, refetchTrigger]);
  return { tokenLocks, refetchTokenLocksByTokenAddress }
}