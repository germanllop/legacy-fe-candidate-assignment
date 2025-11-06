import { Request, Response, NextFunction } from 'express';
import { verifySignatureSchema } from '../schemas/signature';
import * as verificationService from '../services/verificationService';


export const verifySignature = (req: Request, res: Response, next: NextFunction) => {
    console.log('verifySignature');
    const body = req.body;
    const { message, signature } = verifySignatureSchema.parse(body);

    const result = verificationService.verifySignature({message, signature});
    res.status(200).json(result);

    next();
};