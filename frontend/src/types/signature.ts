import type { AddressLike } from "ethers";

export interface SignatureResult {
  isValid: boolean;
  signer: AddressLike | null;
  originalMessage: string;
}

export interface SignedMessage {
  message: string;
  signer: string;
  signature: string;
  isValid: boolean;
}
