import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { SignedMessageList } from "@/components/signed-message-list";
import type { FormEvent } from "react";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { useSignedMessages } from "@/hooks/useSignedMessages";
import { verifySignature } from "@/lib/api/signature";
import type { SignatureResult } from "@/types/signature";

const MAX_MESSAGE_LENGTH = 256;

// This component stays lean because signing + persistence live in hooks/services
const SignMessage = () => {
  const isLoggedIn = useIsLoggedIn();
  const { primaryWallet } = useDynamicContext();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "signing">("idle");
  const [error, setError] = useState<string | null>(null);
  // Persist per-wallet history in localStorage via a hook so re-logins replay past signatures
  const { messages, addMessage } = useSignedMessages(primaryWallet?.address);

  if (!isLoggedIn || !primaryWallet) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!trimmedMessage) {
      setError("Please enter a message to sign.");
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_API_URL;

    if (!apiBaseUrl) {
      setError("API URL is not configured.");
      return;
    }

    try {
      setStatus("signing");
      setError(null);

      if (typeof primaryWallet.signMessage !== "function") {
        throw new Error("Active wallet does not support message signing.");
      }

      // Signing is delegated to Dynamic's wallet instance; no direct window provider access needed
      const signature = await primaryWallet.signMessage(trimmedMessage);

      if (!signature) {
        throw new Error("Wallet failed to produce a signature.");
      }

      const result: SignatureResult = await verifySignature(apiBaseUrl, {
        message: trimmedMessage,
        signature,
      });

      if (!result.isValid) {
        setError("Signature is not valid.");
        return;
      }

      const resolvedSigner = (() => {
        if (result.signer) {
          return typeof result.signer === "string"
            ? result.signer
            : String(result.signer);
        }
        return primaryWallet.address ?? "Unknown signer";
      })();

      addMessage({
        message: result.originalMessage,
        signature,
        signer: resolvedSigner,
        isValid: true,
      });
      setMessage("");
    } catch (err) {
      const reason =
        err instanceof Error ? err.message : "Unable to sign the message.";
      setError(reason);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section className="w-full max-w-2xl space-y-6">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="message">Message to sign</FieldLabel>
            <textarea
              id="message"
              value={message}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[120px] w-full rounded-md border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter a message (max 256 characters)"
              required
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </Field>
          <Button
            type="submit"
            disabled={status === "signing"}
            className="w-full"
          >
            {status === "signing" ? "Signing..." : "Sign & verify"}
          </Button>
        </FieldGroup>
      </form>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div>
        <h3 className="mb-2 text-base font-semibold">Validated messages</h3>
        {messages.length > 0 ? (
          <SignedMessageList messages={messages} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No verified messages for this wallet yet.
          </p>
        )}
      </div>
    </section>
  );
};

export { SignMessage };
