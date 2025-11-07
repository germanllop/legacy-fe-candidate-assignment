
import { shortWalletAddress } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface SignedMessageItemProps {
  message: string;
  signer: string;
  isValid: boolean;
  signature: string;
}

const SignedMessageItem = ({
  message,
  signer,
  isValid,
  signature,
}: SignedMessageItemProps) => {
  const badgeStyles = isValid
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
    : "bg-destructive/10 text-destructive";

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div>
          <CardDescription>Signer</CardDescription>
          <CardTitle className="font-mono text-base font-normal">
            {shortWalletAddress(signer)}
          </CardTitle>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles}`}>
          {isValid ? "Validated" : "Rejected"}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Message
          </p>
          <p className="mt-1 rounded-lg bg-muted/40 p-3 text-sm leading-relaxed">
            {message}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Signature
          </p>
          <p className="mt-1 break-all font-mono text-xs text-foreground/80">
            {signature}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export { SignedMessageItem };
