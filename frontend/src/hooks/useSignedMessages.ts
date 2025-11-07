import { useCallback, useEffect, useState } from "react";

import type { SignedMessage } from "@/types/signature";
import {
  getMessagesForWallet,
  setMessagesForWallet,
  clearMessagesForWallet,
} from "@/lib/storage";

export const useSignedMessages = (walletAddress?: string) => {
  const [messages, setMessages] = useState<SignedMessage[]>([]);

  useEffect(() => {
    if (!walletAddress) {
      setMessages([]);
      return;
    }

    setMessages(getMessagesForWallet(walletAddress));
  }, [walletAddress]);

  const addMessage = useCallback(
    (message: SignedMessage) => {
      if (!walletAddress) {
        return;
      }

      setMessages((prev) => {
        const updated = [message, ...prev];
        setMessagesForWallet(walletAddress, updated);
        return updated;
      });
    },
    [walletAddress]
  );

  const resetMessages = useCallback(() => {
    if (!walletAddress) {
      return;
    }
    clearMessagesForWallet(walletAddress);
    setMessages([]);
  }, [walletAddress]);

  return {
    messages,
    addMessage,
    resetMessages,
  };
};
