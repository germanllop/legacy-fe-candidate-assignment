import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const EXPECTED_WALLET_ADDRESS_LENGTH = 42;

export function shortWalletAddress(address: string) {
  if (address.length !== EXPECTED_WALLET_ADDRESS_LENGTH) {
    throw new Error(
      `Wallet address must be ${EXPECTED_WALLET_ADDRESS_LENGTH} characters long`
    );
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
