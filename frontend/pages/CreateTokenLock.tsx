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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast"

// Internal utils
import { aptosClient } from "@/utils/aptosClient";

// Internal constants
// Entry functions
import { createTokenLock } from "@/entry-functions/create_token_lock";
import { DateTimeInput } from "@/components/ui/date-time-input";
import { dateToMicroseconds, daysToMicroseconds, formatTimeForInput, monthsToMicroseconds } from "@/lib/utils";

export function CreateTokenLock() {
  // Wallet Adapter provider

  const aptosWallet = useWallet();
  const { account, wallet, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast()


  // Collection data entered by the user on UI
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [cliffDateTime, setCliffDateTime] = useState<Date>(new Date());

  const [vestingDuration, setVestingDuration] = useState<number>(0);
  const [periodicity, setPeriodicity] = useState<number>(0);
  const [claimantAddress, setClaimantAddress] = useState<string>("");

  // Internal state
  const [isUploading, setIsUploading] = useState(false);


  const disableCreateSubmitButton =
    !tokenAddress || !amount || !cliffDateTime || !periodicity || !claimantAddress || !vestingDuration || !account || isUploading;

  // On create asset button clicked
  const onCreateTokenLock = async () => {
    try {
      if (!account) throw new Error("Connect wallet first");
      console.log("Creating token lock...");
      console.log("Token Address:", tokenAddress);
      console.log("Amount:", amount);
      console.log("Cliff Timestamp:", dateToMicroseconds(cliffDateTime));
      console.log("Vesting Duration:", vestingDuration);
      console.log("Periodicity:", periodicity);
      console.log("Claimant Address:", claimantAddress);
      // Set internal isUploading state
      setIsUploading(true);

      // Submit a create_fa entry function transaction
      const response = await signAndSubmitTransaction(
        createTokenLock({
          tokenAddress, amount, cliffTimestamp: dateToMicroseconds(cliffDateTime), vestingDuration, periodicity, claimantAddress
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
          description: "Your token lock has been created successfully.",
          duration: 5000
        })
      }
    } catch (error) {
      alert(error);
      setIsUploading(false);

    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <LaunchpadHeader title="Create Token Lock" />
      <div className="flex flex-col md:flex-row items-start justify-between px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full md:w-2/3 flex flex-col gap-y-4 order-2 md:order-1">
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
            className="my-4"
            id="cliff-timestamp"
            title="Cliff Timestamp"
            tooltip="The time after which the asset can start to be withdrawn. This is in Local Time."
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

                console.log("Cliff microseconds:", dateToMicroseconds(newDate));

              }
              console.log("Date changed:", date);

            }}
            onTimeChange={(e) => {
              const [hours, minutes] = e.target.value.split(':').map(Number);
              const newDate = new Date(cliffDateTime);
              newDate.setHours(hours, minutes);


              setCliffDateTime(newDate);

              console.log("Time changed:", e.target.value, "New date:", newDate);
              console.log("Cliff microseconds:", dateToMicroseconds(newDate));

            }}

            disabled={isUploading || !account}
          />

          {/* <div>{dateToMicroseconds(cliffDateTime)}</div> */}

          <div className="space-y-2 my-4">
            <Label htmlFor="vesting-duration">Vesting Duration</Label>
            <Select
              required
              disabled={isUploading || !account}
              onValueChange={(value) => setVestingDuration(Number(value))}>
              <SelectTrigger id="vesting-duration">
                <SelectValue placeholder="Select vesting duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={monthsToMicroseconds(1).toString()}>1 month</SelectItem>
                <SelectItem value={monthsToMicroseconds(3).toString()}>3 months</SelectItem>
                <SelectItem value={monthsToMicroseconds(6).toString()}>6 months</SelectItem>
                <SelectItem value={monthsToMicroseconds(12).toString()}>1 year</SelectItem>
                <SelectItem value={monthsToMicroseconds(24).toString()}>2 years</SelectItem>
                <SelectItem value={monthsToMicroseconds(36).toString()}>3 years</SelectItem>
                <SelectItem value={monthsToMicroseconds(48).toString()}>4 years</SelectItem>
                <SelectItem value={monthsToMicroseconds(60).toString()}>5 years</SelectItem>
                <SelectItem value={monthsToMicroseconds(120).toString()}>10 years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 my-4">
            <Label htmlFor="vesting-duration">Periodicity</Label>
            <Select
              required
              disabled={isUploading || !account}
              onValueChange={(value) => setPeriodicity(Number(value))}>
              <SelectTrigger id="vesting-duration">
                <SelectValue placeholder="Select how often users can claim" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={daysToMicroseconds(1).toString()}>Daily</SelectItem>
                <SelectItem value={daysToMicroseconds(7).toString()}>Weekly</SelectItem>
                <SelectItem value={monthsToMicroseconds(1).toString()}>Monthly</SelectItem>
                <SelectItem value={monthsToMicroseconds(3).toString()}>Quarterly</SelectItem>
                <SelectItem value={monthsToMicroseconds(6).toString()}>Bi-annually</SelectItem>
                <SelectItem value={monthsToMicroseconds(12).toString()}>Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <LabeledInput
            id="periodicity"
            label="Periodicity"
            tooltip="How often the tokens are released."
            required
            onChange={(e) => setPeriodicity(Number(e.target.value))}
            disabled={isUploading || !account}
            type="number"
          /> */}

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
            title="Create Token Lock"
            className="self-start"
            onSubmit={onCreateTokenLock}
            disabled={disableCreateSubmitButton}
            confirmMessage={
              <>
                <p>
                  Please ensure that the entered fields are correct.
                  {/* Cliffdate {cliffDateTime.toLocaleString()}
                  Vesting Duration {vestingDuration}
                  Periodicity {periodicity}
                  Amount {amount}
                  Token Address {tokenAddress}
                  Claimant Address {claimantAddress} */}
                  Proceed to sign the Token Lock Transaction to continue.
                </p>
              </>
            }
          />
        </div>

      </div>
    </>
  );
}
