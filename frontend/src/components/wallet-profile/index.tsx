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

const WalletProfile = () => {
  const { user, primaryWallet, handleLogOut } = useDynamicContext();

  const address = primaryWallet?.address ?? "";
  const walletLabel = primaryWallet?.connector?.name ?? "Connected wallet";
  const walletChain = primaryWallet?.chain;

  const displayName = user?.email ?? user?.username ?? "Anonymous user";

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
          <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-base">
            {address ? shortWalletAddress(address) : "No wallet detected"}
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
