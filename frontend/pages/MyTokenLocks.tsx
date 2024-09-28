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
import { useEffect } from "react";
import { microsecondsToLocalTime, microsecondsToTimeString } from "@/lib/utils";
import { truncateAddress } from "@/utils/truncateAddress";
import { Button } from "@/components/ui/button";

export function MyTokenLocks() {

  const tokenLocks = useGetTokenLocksByUser();

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
                    <TableCell><Button>Claim</Button></TableCell>

                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

      </div>
    </>
  );
}
