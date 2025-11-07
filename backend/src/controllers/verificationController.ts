import { Request, Response, NextFunction } from 'express';
import { verifySignatureSchema } from '../schemas/signature';
import * as verificationService from '../services/verificationService';

export const verifySignature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message, signature } = verifySignatureSchema.parse(req.body);
    const result = await verificationService.verifySignature({ message, signature });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
