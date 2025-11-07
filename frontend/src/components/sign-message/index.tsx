import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { SignedMessageList } from "@/components/signed-message-list";
import type { FormEvent } from "react";
import type { SignedMessageItemProps } from "@/components/signed-message-item";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import type { AddressLike } from "ethers";

type SignatureResult = {
  isValid: boolean;
  signer: AddressLike | null;
  originalMessage: string;
};

const MAX_MESSAGE_LENGTH = 256;
const STORAGE_KEY = "signedMessages";

type StoredMessages = Record<string, SignedMessageItemProps[]>;

const getStoredMessages = (): StoredMessages => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredMessages) : {};
  } catch (error) {
    console.error("Failed to parse stored messages", error);
    return {};
  }
};

const setStoredMessages = (value: StoredMessages) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to persist messages", error);
  }
};

const SignMessage = () => {
  const isLoggedIn = useIsLoggedIn();
  const { primaryWallet } = useDynamicContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<SignedMessageItemProps[]>([]);
  const [status, setStatus] = useState<"idle" | "signing">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const address = primaryWallet?.address?.toLowerCase();
    if (!address) {
      setMessages([]);
      return;
    }

    const stored = getStoredMessages();
    setMessages(stored[address] ?? []);
  }, [primaryWallet?.address]);

  const visibleMessages = useMemo(() => {
    const currentAddress = primaryWallet?.address?.toLowerCase();
    if (!currentAddress) {
      return [];
    }
    return messages.filter(
      (signedMessage) =>
        signedMessage.signer.toLowerCase() === currentAddress
    );
  }, [messages, primaryWallet?.address]);

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

      const signature = await primaryWallet.signMessage(trimmedMessage);

      if (!signature) {
        throw new Error("Wallet failed to produce a signature.");
      }

      const response = await fetch(
        `${apiBaseUrl}/api/verify-signature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmedMessage,
            signature,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify signature");
      }

      const result = (await response.json()) as SignatureResult;

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

      setMessages((prev) => {
        const updated: SignedMessageItemProps[] = [
          {
            message: result.originalMessage,
            signature,
            signer: resolvedSigner,
            isValid: true,
          },
          ...prev,
        ];

        const addressKey = primaryWallet.address?.toLowerCase();
        if (addressKey) {
          const stored = getStoredMessages();
          setStoredMessages({
            ...stored,
            [addressKey]: updated,
          });
        }

        return updated;
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
        {visibleMessages.length > 0 ? (
          <SignedMessageList messages={visibleMessages} />
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
