import { assert } from "console"


describe('verificationService.verifySignature', () => {
    it('should verify a valid signature', async () => {
        //TODO
        assert(true);
    })
})
import { verifySignature } from '../src/services/verificationService';
import { SignatureRequestBody } from '../src/schemas/signature';

describe('verificationService.verifySignature', () => {
  const validPayload: SignatureRequestBody = {
    message: 'test message',
    signature:
      '0xc0f4d004dcda9dfacd4ac82520b5143f234eb7685152daf5b586d4865ebf733e7a305ca6607a51d573189945c21af97a5ca4853bbfab056648d75d45d77c4bcf1b',
  };
  const signerAddress = '0x6959f20256df8cbc83f8a78b7bc37676abf0b32f';

  it('returns a valid signature result including the signer address', async () => {
    const result = await verifySignature(validPayload);

    expect(result.isValid).toBe(true);
    expect(result.originalMessage).toBe(validPayload.message);
    expect(result.signer?.toString().toLowerCase()).toBe(signerAddress.toLowerCase());
  });

  it('returns an invalid result for malformed signatures', async () => {
    const invalidPayload: SignatureRequestBody = {
      message: 'test message',
      signature: '0x1234',
    };

    const result = await verifySignature(invalidPayload);

    expect(result).toEqual({
      isValid: false,
      signer: null,
      originalMessage: 'test message',
    });
  });
});
