import { describe, beforeEach, it, expect } from "vitest";

import {
  getMessagesForWallet,
  setMessagesForWallet,
  clearMessagesForWallet,
} from "./storage";

const WALLET = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

const sampleMessage = {
  message: "Hello",
  signer: WALLET,
  signature: "0xsigned",
  isValid: true,
};

describe("storage helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists and retrieves messages per wallet", () => {
    setMessagesForWallet(WALLET, [sampleMessage]);

    expect(getMessagesForWallet(WALLET)).toEqual([sampleMessage]);
  });

  it("clears messages for a wallet", () => {
    setMessagesForWallet(WALLET, [sampleMessage]);
    clearMessagesForWallet(WALLET);

    expect(getMessagesForWallet(WALLET)).toEqual([]);
  });
});
