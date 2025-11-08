import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { useSignedMessages } from "./useSignedMessages";

const getMessagesForWallet = vi.fn();
const setMessagesForWallet = vi.fn();
const clearMessagesForWallet = vi.fn();

vi.mock("@/lib/storage", () => ({
  getMessagesForWallet: (...args: unknown[]) => getMessagesForWallet(...args),
  setMessagesForWallet: (...args: unknown[]) => setMessagesForWallet(...args),
  clearMessagesForWallet: (...args: unknown[]) => clearMessagesForWallet(...args),
}));

const WALLET = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const anotherWallet = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const sampleMessage = {
  message: "hello",
  signature: "0xsigned",
  signer: WALLET,
  isValid: true,
};

describe("useSignedMessages", () => {
  beforeEach(() => {
    getMessagesForWallet.mockReset();
    setMessagesForWallet.mockReset();
    clearMessagesForWallet.mockReset();
    getMessagesForWallet.mockReturnValue([]);
  });

  it("loads messages for the current wallet", async () => {
    getMessagesForWallet.mockReturnValue([sampleMessage]);

    const { result } = renderHook(() => useSignedMessages(WALLET));

    await waitFor(() => {
      expect(result.current.messages).toEqual([sampleMessage]);
    });
    expect(getMessagesForWallet).toHaveBeenCalledWith(WALLET);
  });

  it("persists new messages via storage", async () => {
    const { result } = renderHook(() => useSignedMessages(WALLET));

    await act(async () => {
      result.current.addMessage(sampleMessage);
    });

    expect(setMessagesForWallet).toHaveBeenCalledWith(WALLET, [sampleMessage]);
    expect(result.current.messages[0]).toEqual(sampleMessage);
  });

  it("resets messages when requested", async () => {
    const { result, rerender } = renderHook(({ wallet }) => useSignedMessages(wallet), {
      initialProps: { wallet: WALLET },
    });

    await act(async () => {
      result.current.addMessage(sampleMessage);
      result.current.resetMessages();
    });

    expect(clearMessagesForWallet).toHaveBeenCalledWith(WALLET);
    expect(result.current.messages).toEqual([]);

    rerender({ wallet: anotherWallet });
    await waitFor(() => {
      expect(getMessagesForWallet).toHaveBeenCalledWith(anotherWallet);
    });
  });
});
