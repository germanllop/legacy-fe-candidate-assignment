import { z } from 'zod';
import { AddressLike } from 'ethers';

export const verifySignatureSchema = z.object({
    message: z.string(),
    signature: z.string(),
});

export type SignatureRequestBody = z.infer<typeof verifySignatureSchema>;

export type SignatureResult = {
    isValid: boolean;
    signer: AddressLike | null;
    originalMessage: string;
};