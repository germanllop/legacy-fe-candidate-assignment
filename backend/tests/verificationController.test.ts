
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { verifySignature as verifySignatureController } from '../src/controllers/verificationController';
import * as verificationService from '../src/services/verificationService';

jest.mock('../src/services/verificationService');

const buildRequest = (body: unknown): Request => ({ body } as Request);

const buildResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const buildNext = () => jest.fn() as jest.MockedFunction<NextFunction>;

describe('verificationController.verifySignature', () => {
  const mockedService =
    verificationService.verifySignature as jest.MockedFunction<
      typeof verificationService.verifySignature
    >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('responds with the verification result when the payload matches the schema', () => {
    const payload = { message: 'hello world', signature: '0xdeadbeef' };
    const serviceResponse = Promise.resolve({
      isValid: true,
      signer: '0x1234',
      originalMessage: payload.message,
    });

    mockedService.mockReturnValue(serviceResponse);

    const req = buildRequest(payload);
    const res = buildResponse();
    const next = buildNext();

    verifySignatureController(req, res, next);

    expect(mockedService).toHaveBeenCalledWith(payload);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(serviceResponse);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('throws a ZodError when the payload violates the schema', () => {
    const invalidPayload = { message: 123, signature: null };
    const req = buildRequest(invalidPayload);
    const res = buildResponse();
    const next = buildNext();

    expect(() => verifySignatureController(req, res, next)).toThrow(ZodError);
    expect(mockedService).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
