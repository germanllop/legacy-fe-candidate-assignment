import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { shortWalletAddress } from "@/lib/utils";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";

const WalletProfile = () => {
  const { user, primaryWallet, handleLogOut } = useDynamicContext();
  const [copied, setCopied] = useState(false);

  const address = primaryWallet?.address ?? "";
  const walletLabel = primaryWallet?.connector?.name ?? "Connected wallet";
  const walletChain = primaryWallet?.chain;

  const displayName = user?.email ?? user?.username ?? "Anonymous user";

  const handleCopyAddress = async () => {
    if (!address || typeof navigator === "undefined") {
      return;
    }

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{displayName}</CardTitle>
        <CardDescription>Signed in as</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{walletLabel}</span>
            {walletChain && <span className="uppercase">{walletChain}</span>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="font-mono text-base">
              {address ? shortWalletAddress(address) : "No wallet detected"}
            </span>
            {address && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyAddress}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="button" variant="outline" onClick={handleLogOut}>
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
};

export { WalletProfile };
