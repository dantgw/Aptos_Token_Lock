import { FC } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
// Internal components
import { WalletSelector } from "@/components/WalletSelector";
import { buttonVariants } from "@/components/ui/button";

import vaultifyIcon from '../assets/icons/vaultify_logo.png'; // Adjust the path as needed
interface LaunchpadHeaderProps {
  title: string;
}

export const LaunchpadHeader: FC<LaunchpadHeaderProps> = ({ title }) => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between py-2 px-4 mx-auto w-full max-w-screen-xl flex-wrap">
      <img src={vaultifyIcon} alt="Launchpad Icon" className="size-12" />
      <h2 className="display">{title}</h2>
      <div className="flex gap-2 items-center">
        <Link className={buttonVariants({ variant: "link" })} to={"/token-locks"}>
          Token Locks
        </Link>
        <Link className={buttonVariants({ variant: "link" })} to={"/my-token-locks"}>
          My Token Locks
        </Link>
        <Link className={buttonVariants({ variant: "link" })} to={"/create-token-lock"}>
          Lock
        </Link>

        <WalletSelector />
      </div>
    </div>
  );
};
