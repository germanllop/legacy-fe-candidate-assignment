import {ethers, AddressLike} from "ethers";
import { SignatureRequestBody, SignatureResult } from "../schemas/signature";

export const verifySignature = async (signatureRequestBody:SignatureRequestBody): Promise<SignatureResult> => {
    const { message, signature } = signatureRequestBody;
    let isValid:boolean = false;
    let signer:AddressLike | null = null;
    let originalMessage:string = message;

    const recoveredAddress:AddressLike = ethers.verifyMessage(message, signature);

    if(ethers.isAddress(recoveredAddress)) {
        isValid = true;
        signer = recoveredAddress;
        originalMessage = message;
    }

    return {
        isValid,
        signer,
        originalMessage
    }    
    
};