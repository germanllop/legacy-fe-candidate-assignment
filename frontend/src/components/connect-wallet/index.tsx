import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";

import {
  useConnectWithOtp,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { WalletProfile } from "../wallet-profile";
import { SignMessage } from "../sign-message";
import { useEffect } from "react";

import type { FormEvent } from "react";
import { useOtpLogin } from "@/hooks/useOtpLogin";

const ConnectWallet = () => {
  const isLoggedIn = useIsLoggedIn();
  const { connectWithEmail, verifyOneTimePassword, retryOneTimePassword } =
    useConnectWithOtp();
  const {
    state: { loginStep, status, error, infoMessage },
    email,
    setEmail,
    otp,
    setOtp,
    actions: { submitEmail, verifyOtp, resendCode, editEmail, resetFlow },
  } = useOtpLogin({
    connectWithEmail,
    verifyOneTimePassword,
    retryOneTimePassword,
  });

  useEffect(() => {
    if (isLoggedIn) {
      resetFlow();
    }
  }, [isLoggedIn, resetFlow]);

  const handleSendEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitEmail();
  };

  const handleVerifyOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verifyOtp();
  };

  const isSending = status === "sending";
  const isVerifying = status === "verifying";
  const isResending = status === "resending";

  return (
    <div className="flex flex-col items-center justify-center">
      {!isLoggedIn ? (
        <div className="w-full max-w-md">
          {loginStep === "email" && (
            <form onSubmit={handleSendEmail}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    placeholder="user@email.com"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    disabled={isSending}
                  />
                </Field>
                <Button type="submit" disabled={isSending} className="w-full">
                  {isSending ? "Sending code..." : "Send login code"}
                </Button>
              </FieldGroup>
            </form>
          )}

          {loginStep === "otp" && (
            <form onSubmit={handleVerifyOtp}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="otp">
                    Enter the 6-digit code sent to {email}
                  </FieldLabel>
                  <Input
                    id="otp"
                    placeholder="123456"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    autoComplete="one-time-code"
                    required
                    disabled={isVerifying}
                  />
                </Field>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isVerifying} className="flex-1">
                    {isVerifying ? "Verifying..." : "Verify code"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={editEmail}
                  >
                    Edit email
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={resendCode}
                  disabled={isResending}
                >
                  {isResending ? "Sending another code..." : "Resend code"}
                </Button>
              </FieldGroup>
            </form>
          )}

          {error && (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {infoMessage && !error && (
            <p className="mt-4 text-sm text-muted-foreground">{infoMessage}</p>
          )}
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-8">
          <WalletProfile />
          <SignMessage />
        </div>
      )}
    </div>
  );
};

export { ConnectWallet };
