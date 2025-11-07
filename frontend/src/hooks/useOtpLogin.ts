import { useCallback, useState } from "react";

export type LoginStep = "email" | "otp";
export type LoginStatus = "idle" | "sending" | "verifying" | "resending";

interface UseOtpLoginOptions {
  connectWithEmail: (email: string) => Promise<void>;
  verifyOneTimePassword: (otp: string) => Promise<unknown>;
  retryOneTimePassword: () => Promise<unknown>;
}

export const useOtpLogin = ({
  connectWithEmail,
  verifyOneTimePassword,
  retryOneTimePassword,
}: UseOtpLoginOptions) => {
  const [loginStep, setLoginStep] = useState<LoginStep>("email");
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const resetFlow = useCallback(() => {
    setLoginStep("email");
    setStatus("idle");
    setEmail("");
    setOtp("");
    setError(null);
    setInfoMessage(null);
  }, []);

  const editEmail = useCallback(() => {
    setLoginStep("email");
    setOtp("");
    setError(null);
    setInfoMessage(null);
  }, []);

  const submitEmail = useCallback(async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("sending");
      setError(null);
      await connectWithEmail(trimmedEmail);
      setEmail(trimmedEmail);
      setLoginStep("otp");
      setInfoMessage(`We sent a one-time code to ${trimmedEmail}.`);
    } catch (err) {
      const reason = err instanceof Error ? err.message : "Unable to start the login flow.";
      setError(reason);
    } finally {
      setStatus("idle");
    }
  }, [connectWithEmail, email]);

  const verifyOtp = useCallback(async () => {
    const trimmedOtp = otp.trim();
    if (!trimmedOtp) {
      setError("Enter the code you received by email.");
      return;
    }

    try {
      setStatus("verifying");
      setError(null);
      await verifyOneTimePassword(trimmedOtp);
      setInfoMessage("Code verified. Finalizing sign-in...");
    } catch (err) {
      const reason =
        err instanceof Error
          ? err.message
          : "Verification failed. Double-check the code and try again.";
      setError(reason);
    } finally {
      setStatus("idle");
    }
  }, [otp, verifyOneTimePassword]);

  const resendCode = useCallback(async () => {
    try {
      setStatus("resending");
      setError(null);
      await retryOneTimePassword();
      setInfoMessage(`Sent a new code to ${email}.`);
    } catch (err) {
      const reason =
        err instanceof Error
          ? err.message
          : "Unable to resend the code. Please try again shortly.";
      setError(reason);
    } finally {
      setStatus("idle");
    }
  }, [email, retryOneTimePassword]);

  return {
    state: {
      loginStep,
      status,
      error,
      infoMessage,
    },
    email,
    setEmail,
    otp,
    setOtp,
    actions: {
      submitEmail,
      verifyOtp,
      resendCode,
      editEmail,
      resetFlow,
    },
  };
};
