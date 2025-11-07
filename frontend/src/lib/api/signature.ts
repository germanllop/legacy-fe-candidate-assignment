import type { SignatureResult } from "@/types/signature";

interface VerifySignaturePayload {
  message: string;
  signature: string;
}

export const verifySignature = async (
  apiBaseUrl: string,
  payload: VerifySignaturePayload
): Promise<SignatureResult> => {
  const response = await fetch(`${apiBaseUrl}/api/verify-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to verify signature");
  }

  return response.json();
};
