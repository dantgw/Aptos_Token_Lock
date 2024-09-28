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
import { useGetTokenLocksByTokenAddress } from "@/hooks/useGetTokenLocksByTokenAddress";
import TokenUnlockGraph from "./components/TokenUnlockGraph";

export function TokenLocks() {
  // Wallet Adapter provider

  const aptosWallet = useWallet();
  const { account, wallet, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast()


  // Collection data entered by the user on UI
  const [tokenAddress, setTokenAddress] = useState<string>("0x59f11fa094e3b0628b9de7eddc63a22e7ca754f4d96ddf1e53a4e9270745f9fd");

  // Internal state
  const [isUploading, setIsUploading] = useState(false);

  const { tokenLocks, refetchTokenLocksByTokenAddress } = useGetTokenLocksByTokenAddress(tokenAddress);


  return (
    <>
      <LaunchpadHeader title="Token Locks" />
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
            value={tokenAddress}
          />
          <div>{tokenLocks?.[0]?.balance_amount}</div>
          <TokenUnlockGraph />
        </div>
      </div>
    </>
  );
}
