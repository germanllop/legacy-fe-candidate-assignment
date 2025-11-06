import { ethers, AddressLike } from "ethers";
import { SignatureRequestBody, SignatureResult } from "../schemas/signature";

export const verifySignature = async (
  signatureRequestBody: SignatureRequestBody
): Promise<SignatureResult> => {
  const { message, signature } = signatureRequestBody;
  let isValid: boolean = false;
  let signer: AddressLike | null = null;
  let originalMessage: string = message;
  let recoveredAddress: AddressLike | null = null;

  try {
    recoveredAddress = ethers.verifyMessage(message, signature);
  } catch (error) {
    return {
      isValid,
      signer,
      originalMessage,
    };
  }

  if (recoveredAddress && ethers.isAddress(recoveredAddress)) {
    isValid = true;
    signer = recoveredAddress;
    originalMessage = message;
  }

  return {
    isValid,
    signer,
    originalMessage,
  };
};
