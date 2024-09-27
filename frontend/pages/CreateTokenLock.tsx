import { isAptosConnectWallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
// Internal components
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WarningAlert } from "@/components/ui/warning-alert";
import { UploadSpinner } from "@/components/UploadSpinner";
import { LabeledInput } from "@/components/ui/labeled-input";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
// Internal utils
import { checkIfFund, uploadFile } from "@/utils/Irys";
import { aptosClient } from "@/utils/aptosClient";
// Internal constants
import { CREATOR_ADDRESS } from "@/constants";
// Entry functions
import { createAsset } from "@/entry-functions/create_asset";
import { createTokenLock } from "@/entry-functions/create_token_lock";
import { DateTimeInput } from "@/components/ui/date-time-input";
import { dateToMicroseconds, formatTimeForInput } from "@/lib/utils";

export function CreateTokenLock() {
  // Wallet Adapter provider
  const aptosWallet = useWallet();
  const { account, wallet, signAndSubmitTransaction } = useWallet();


  // Collection data entered by the user on UI
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [cliffDateTime, setCliffDateTime] = useState<Date>(new Date());
  const [cliffUTCDateTime, setCliffUTCDateTime] = useState<Date>(new Date());

  const [vestingDuration, setVestingDuration] = useState<number>(0);
  const [periodicity, setPeriodicity] = useState<number>(0);
  const [claimantAddress, setClaimantAddress] = useState<string>("");

  // Internal state
  const [isUploading, setIsUploading] = useState(false);


  const disableCreateAssetButton =
    !tokenAddress || !amount || !cliffDateTime || !periodicity || !claimantAddress || !vestingDuration || !account || isUploading;

  // On create asset button clicked
  const onCreateAsset = async () => {
    try {
      if (!account) throw new Error("Connect wallet first");

      // Set internal isUploading state
      setIsUploading(true);

      // Submit a create_fa entry function transaction
      const response = await signAndSubmitTransaction(
        createTokenLock({
          tokenAddress, amount, cliffTimestamp: dateToMicroseconds(cliffUTCDateTime), vestingDuration, periodicity, claimantAddress
        }),
      );

      // Wait for the transaction to be commited to chain
      const committedTransactionResponse = await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });

      // Once the transaction has been successfully commited to chain, navigate to the `my-assets` page
      if (committedTransactionResponse.success) {
        // navigate(`/my-assets`, { replace: true });
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <LaunchpadHeader title="Create Asset" />
      <div className="flex flex-col md:flex-row items-start justify-between px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full md:w-2/3 flex flex-col gap-y-4 order-2 md:order-1">
          {(!account || account.address !== CREATOR_ADDRESS) && (
            <WarningAlert title={account ? "Wrong account connected" : "No account connected"}>
              To continue with creating your collection, make sure you are connected with a Wallet and with the same
              profile account as in your FA_CREATOR_ADDRESS in{" "}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                .env
              </code>{" "}
              file
            </WarningAlert>
          )}

          {wallet && isAptosConnectWallet(wallet) && (
            <WarningAlert title="Wallet not supported">
              Google account is not supported when creating a Token. Please use a different wallet.
            </WarningAlert>
          )}

          <UploadSpinner on={isUploading} />



          <LabeledInput
            id="asset-name"
            label="Token Address"
            tooltip="The address of the asset, e.g. 0x..."
            required
            onChange={(e) => setTokenAddress(e.target.value)}
            disabled={isUploading || !account}
            type="text"
          />

          <LabeledInput
            id="asset-amount"
            label="Asset Amount"
            tooltip="The number of tokens you would like to deposit."
            required
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={isUploading || !account}
            type="number"
          />

          <DateTimeInput
            id="cliff-timestamp"
            title="Cliff Timestamp"
            tooltip="The time after which the asset can start to be withdrawn."
            required
            date={cliffDateTime}
            time={formatTimeForInput(cliffDateTime)}
            onDateChange={(date) => {
              if (date) {
                const newDate = new Date(cliffDateTime);
                newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                newDate.setSeconds(0)
                newDate.setMilliseconds(0)

                setCliffDateTime(newDate);

                const newUTCDate = new Date(cliffDateTime);



                console.log("Cliff microseconds:", dateToMicroseconds(newDate));
                console.log("Cliff microseconds 2:", dateToMicroseconds(cliffDateTime));

              }
              console.log("Date changed:", date);

            }}
            onTimeChange={(e) => {
              const [hours, minutes] = e.target.value.split(':').map(Number);
              const newDate = new Date(cliffDateTime);
              newDate.setHours(hours, minutes);


              setCliffDateTime(newDate);

              console.log("Time changed:", e.target.value, "New date:", newDate);
              console.log("Cliff microseconds:", dateToMicroseconds(cliffDateTime));

            }}

            disabled={isUploading || !account}
          />



          <LabeledInput
            id="vesting-duration"
            label="Vesting Duration"
            tooltip="The duration in which the asset is vested"
            required
            onChange={(e) => setVestingDuration(Number(e.target.value))}
            disabled={isUploading || !account}
            type="number"
          />

          <LabeledInput
            id="periodicity"
            label="Periodicity"
            tooltip="How often the tokens are released."
            required
            onChange={(e) => setPeriodicity(Number(e.target.value))}
            disabled={isUploading || !account}
            type="number"
          />

          <LabeledInput
            id="claimant-address"
            label="Claimant Address"
            tooltip="Address of the claimant"
            required
            onChange={(e) => setClaimantAddress(e.target.value)}
            disabled={isUploading || !account}
            type="text"
          />

          <ConfirmButton
            title="Create Asset"
            className="self-start"
            onSubmit={onCreateAsset}
            disabled={disableCreateAssetButton}
            confirmMessage={
              <>
                <p>
                  The upload process requires at least 1 message signatures.
                </p>
              </>
            }
          />
        </div>

      </div>
    </>
  );
}
