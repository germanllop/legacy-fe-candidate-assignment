import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConnectWallet } from "./index";

const useIsLoggedInMock = vi.fn();
const connectWithEmailMock = vi.fn();
const verifyOtpMock = vi.fn();
const retryOtpMock = vi.fn();
const useOtpLoginMock = vi.fn();

vi.mock("@dynamic-labs/sdk-react-core", () => ({
  useIsLoggedIn: () => useIsLoggedInMock(),
  useConnectWithOtp: () => ({
    connectWithEmail: connectWithEmailMock,
    verifyOneTimePassword: verifyOtpMock,
    retryOneTimePassword: retryOtpMock,
  }),
}));

vi.mock("@/hooks/useOtpLogin", () => ({
  useOtpLogin: (...args: unknown[]) => useOtpLoginMock(...args),
}));

vi.mock("../wallet-profile", () => ({
  WalletProfile: () => <div data-testid="profile">Profile</div>,
}));

vi.mock("../sign-message", () => ({
  SignMessage: () => <div data-testid="signer">Sign</div>,
}));

const baseHookState = {
  state: { loginStep: "email", status: "idle", error: null, infoMessage: null },
  email: "",
  setEmail: vi.fn(),
  otp: "",
  setOtp: vi.fn(),
  actions: {
    submitEmail: vi.fn(),
    verifyOtp: vi.fn(),
    resendCode: vi.fn(),
    editEmail: vi.fn(),
    resetFlow: vi.fn(),
  },
};

describe("ConnectWallet", () => {
  beforeEach(() => {
    useIsLoggedInMock.mockReturnValue(false);
    useOtpLoginMock.mockReturnValue(baseHookState);
  });

  it("renders the email form when logged out", () => {
    render(<ConnectWallet />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/code/i)).not.toBeInTheDocument();
  });

  it("renders the OTP view when step is otp", () => {
    useOtpLoginMock.mockReturnValue({
      ...baseHookState,
      state: { ...baseHookState.state, loginStep: "otp" as const },
      email: "user@example.com",
    });

    render(<ConnectWallet />);

    expect(screen.getByLabelText(/6-digit code/i)).toBeInTheDocument();
  });

  it("shows profile and signers when logged in", async () => {
    const resetFlow = vi.fn();
    useOtpLoginMock.mockReturnValue({ ...baseHookState, actions: { ...baseHookState.actions, resetFlow } });
    useIsLoggedInMock.mockReturnValue(true);

    render(<ConnectWallet />);

    expect(await screen.findByTestId("profile")).toBeInTheDocument();
    expect(screen.getByTestId("signer")).toBeInTheDocument();
  });

  it("submits the email form", async () => {
    const submitEmail = vi.fn();
    useOtpLoginMock.mockReturnValue({
      ...baseHookState,
      email: "user@example.com",
      actions: { ...baseHookState.actions, submitEmail },
    });

    const user = userEvent.setup();
    render(<ConnectWallet />);

    await user.click(screen.getByRole("button", { name: /send login code/i }));

    expect(submitEmail).toHaveBeenCalled();
  });
});
