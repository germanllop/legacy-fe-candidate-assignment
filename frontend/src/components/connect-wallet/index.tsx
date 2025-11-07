import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";

import {
  useConnectWithOtp,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { WalletProfile } from "../wallet-profile";
import { SignMessage } from "../sign-message";
import { useEffect, useState } from "react";

import type { FormEvent } from "react";

type LoginStep = "email" | "otp";

const ConnectWallet = () => {
  const isLoggedIn = useIsLoggedIn();
  const { connectWithEmail, verifyOneTimePassword, retryOneTimePassword } =
    useConnectWithOtp();
  const [loginStep, setLoginStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "verifying" | "resending"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    setLoginStep("email");
    setEmail("");
    setOtp("");
    setStatus("idle");
    setError(null);
    setMessage(null);
  }, [isLoggedIn]);

  const handleSendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("sending");
      setError(null);
      setEmail(trimmedEmail);
      await connectWithEmail(trimmedEmail);
      setLoginStep("otp");
      setMessage(`We sent a one-time code to ${trimmedEmail}.`);
    } catch (err) {
      const reason =
        err instanceof Error ? err.message : "Unable to start the login flow.";
      setError(reason);
    } finally {
      setStatus("idle");
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedOtp = otp.trim();
    if (!trimmedOtp) {
      setError("Enter the code you received by email.");
      return;
    }

    try {
      setStatus("verifying");
      setError(null);
      await verifyOneTimePassword(trimmedOtp);
      setMessage("Code verified. Finalizing sign-in...");
    } catch (err) {
      const reason =
        err instanceof Error
          ? err.message
          : "Verification failed. Double-check the code and try again.";
      setError(reason);
    } finally {
      setStatus("idle");
    }
  };

  const handleResendCode = async () => {
    try {
      setStatus("resending");
      setError(null);
      await retryOneTimePassword();
      setMessage(`Sent a new code to ${email}.`);
    } catch (err) {
      const reason =
        err instanceof Error
          ? err.message
          : "Unable to resend the code. Please try again shortly.";
      setError(reason);
    } finally {
      setStatus("idle");
    }
  };

  const handleEditEmail = () => {
    setLoginStep("email");
    setOtp("");
    setMessage(null);
    setError(null);
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
                    onClick={handleEditEmail}
                  >
                    Edit email
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleResendCode}
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
          {message && !error && (
            <p className="mt-4 text-sm text-muted-foreground">{message}</p>
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
