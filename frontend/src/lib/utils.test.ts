import { describe, expect, it } from "vitest";

import { shortWalletAddress } from "./utils";

const FULL_ADDRESS = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

describe("shortWalletAddress", () => {
  it("returns a shortened address with prefix", () => {
    expect(shortWalletAddress(FULL_ADDRESS)).toBe("0xaaaa...aaaa");
  });

  it("throws an error if the address not 42 characters", () => {
    expect(() => shortWalletAddress("0x123"))
      .toThrowError(/42 characters/i);
  });
});
