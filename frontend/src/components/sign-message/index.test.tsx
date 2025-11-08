import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, beforeEach, afterEach, it, vi } from "vitest";

import { SignMessage } from "./index";

const signMessageMock = vi.fn();
const addMessageMock = vi.fn();
const useSignedMessagesMock = vi.fn();
const verifySignatureMock = vi.fn();

let isLoggedInMock = true;

vi.mock("@dynamic-labs/sdk-react-core", () => ({
  useIsLoggedIn: () => isLoggedInMock,
  useDynamicContext: () => ({
    primaryWallet: {
      address: "0xabc123",
      signMessage: signMessageMock,
    },
  }),
}));

vi.mock("@/hooks/useSignedMessages", () => ({
  useSignedMessages: (...args: unknown[]) => useSignedMessagesMock(...args),
}));

vi.mock("@/lib/api/signature", () => ({
  verifySignature: (...args: unknown[]) => verifySignatureMock(...args),
}));

describe("SignMessage", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_URL", "http://localhost:3000");
    isLoggedInMock = true;
    signMessageMock.mockResolvedValue("0xsigned");
    verifySignatureMock.mockResolvedValue({
      isValid: true,
      signer: "0xabc123",
      originalMessage: "Hello world",
    });
    useSignedMessagesMock.mockReturnValue({ messages: [], addMessage: addMessageMock });
    addMessageMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("signs and verifies a message, then stores it", async () => {
    const user = userEvent.setup();
    render(<SignMessage />);

    await user.type(screen.getByLabelText(/message to sign/i), "Hello world");
    await user.click(screen.getByRole("button", { name: /sign & verify/i }));

    await waitFor(() => {
      expect(signMessageMock).toHaveBeenCalledWith("Hello world");
      expect(verifySignatureMock).toHaveBeenCalledWith("http://localhost:3000", {
        message: "Hello world",
        signature: "0xsigned",
      });
      expect(addMessageMock).toHaveBeenCalledWith({
        message: "Hello world",
        signature: "0xsigned",
        signer: "0xabc123",
        isValid: true,
      });
    });

    expect(screen.getByLabelText(/message to sign/i)).toHaveValue("");
  });

  it("does not render when the user is logged out", () => {
    isLoggedInMock = false;
    useSignedMessagesMock.mockReturnValue({ messages: [], addMessage: vi.fn() });

    const { container } = render(<SignMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it("surfaces backend verification failures", async () => {
    const user = userEvent.setup();
    verifySignatureMock.mockResolvedValueOnce({
      isValid: false,
      signer: null,
      originalMessage: "tampered",
    });

    render(<SignMessage />);

    await user.type(screen.getByLabelText(/message to sign/i), "tampered");
    await user.click(screen.getByRole("button", { name: /sign & verify/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Signature is not valid.");
    });
    expect(addMessageMock).not.toHaveBeenCalled();
  });
});
