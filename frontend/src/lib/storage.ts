import type { SignedMessage } from "@/types/signature";

const SIGNED_MESSAGES_KEY = "signedMessages";

type SignedMessageStore = Record<string, SignedMessage[]>;

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

const readStore = (): SignedMessageStore => {
  if (!isBrowser()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(SIGNED_MESSAGES_KEY);
    return raw ? (JSON.parse(raw) as SignedMessageStore) : {};
  } catch (error) {
    console.error("Unable to read signed messages from storage", error);
    return {};
  }
};

const writeStore = (store: SignedMessageStore) => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(SIGNED_MESSAGES_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("Unable to persist signed messages", error);
  }
};

const normalizeAddress = (address: string) => address.toLowerCase();

export const getMessagesForWallet = (address?: string): SignedMessage[] => {
  if (!address) {
    return [];
  }

  const store = readStore();
  return store[normalizeAddress(address)] ?? [];
};

export const setMessagesForWallet = (
  address: string,
  messages: SignedMessage[]
) => {
  if (!address) {
    return;
  }

  const store = readStore();
  store[normalizeAddress(address)] = messages;
  writeStore(store);
};

export const clearMessagesForWallet = (address: string) => {
  if (!address) {
    return;
  }

  const store = readStore();
  delete store[normalizeAddress(address)];
  writeStore(store);
};
