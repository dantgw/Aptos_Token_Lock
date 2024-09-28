import { Link, useNavigate } from "react-router-dom";
// Internal components
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// Internal hooks
import { useGetAssetMetadata } from "@/hooks/useGetAssetMetadata";
import { convertAmountFromOnChainToHumanReadable } from "@/utils/helpers";
import { IS_PROD, NETWORK } from "@/constants";
import { Section } from "lucide-react";
import { useGetTokenLocksByUser } from "@/hooks/useGetTokenLocksByUser";
import { useEffect, useState } from "react";
import { microsecondsToLocalTime, microsecondsToTimeString } from "@/lib/utils";
import { truncateAddress } from "@/utils/truncateAddress";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useToast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { claimToken } from "@/entry-functions/claim_token";

export function MyTokenLocks() {

  const { tokenLocks, refetchTokenLocksByUser } = useGetTokenLocksByUser();
  const aptosWallet = useWallet();
  const { account, wallet, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast()

  const [isUploading, setIsUploading] = useState(false);

  const disableClaimSubmitButton = !account || isUploading;


  const onClaimTokenLock = async (row_id: number) => {
    try {
      if (!account) throw new Error("Connect wallet first");

      // Set internal isUploading state
      setIsUploading(true);

      // Submit a create_fa entry function transaction
      const response = await signAndSubmitTransaction(
        claimToken({
          row_id
        }),
      );

      // Wait for the transaction to be commited to chain
      const committedTransactionResponse = await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });

      // Once the transaction has been successfully commited to chain, navigate to the `my-assets` page
      if (committedTransactionResponse.success) {
        // navigate(`/my-assets`, { replace: true });
        toast({
          title: "Transaction Successful",
          description: "You have claimed tokens from the lock successfully.",
          duration: 5000
        })
        refetchTokenLocksByUser()

      }
    } catch (error) {
      alert(error);
      setIsUploading(false);

    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    console.log("tokenLocks", tokenLocks)
  }, [tokenLocks])
  return (
    <>
      <LaunchpadHeader title="My Token Locks" />
      <div className="w-full">
        <Table className="max-w-screen-xl mx-auto">
          {!tokenLocks.length && <TableCaption>A list of the tokens locks you have.</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Token Address</TableHead>
              <TableHead>Cliff Date/Time</TableHead>
              <TableHead>Vesting Duration</TableHead>
              <TableHead>Periodicity</TableHead>
              <TableHead>Initial Allocation</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Last Claimed</TableHead>
              <TableHead></TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {tokenLocks.length > 0 &&
              tokenLocks.map((tokenLock, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Link
                        to={`https://explorer.aptoslabs.com/token/${tokenLock.token_address}?network=${NETWORK}`}
                        target="_blank"
                        style={{ textDecoration: "underline" }}
                      >
                        {truncateAddress(tokenLock.token_address)}
                      </Link>
                    </TableCell>
                    <TableCell>{microsecondsToLocalTime(tokenLock.cliff_timestamp)}</TableCell>
                    <TableCell>{microsecondsToTimeString(tokenLock.vesting_duration)}</TableCell>
                    <TableCell>{microsecondsToTimeString(tokenLock.periodicity)}</TableCell>
                    <TableCell>{tokenLock.initial_amount}</TableCell>
                    <TableCell>{tokenLock.balance_amount}</TableCell>
                    <TableCell>{microsecondsToLocalTime(tokenLock.last_claimed_timestamp)}</TableCell>
                    <TableCell> <ConfirmButton
                      title="Claim"
                      className="self-start"
                      onSubmit={() => onClaimTokenLock(tokenLock.row_id)}
                      disabled={disableClaimSubmitButton}
                      confirmMessage={
                        <>
                          <p>
                            Proceed to sign the Transaction to claim your tokens.
                          </p>
                        </>
                      }
                    /></TableCell>

                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

      </div>
    </>
  );
}
