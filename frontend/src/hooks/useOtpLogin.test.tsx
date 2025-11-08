import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useOtpLogin } from "./useOtpLogin";

describe("useOtpLogin", () => {
  const connectWithEmail = vi.fn();
  const verifyOneTimePassword = vi.fn();
  const retryOneTimePassword = vi.fn();

  const setupHook = () =>
    renderHook(() =>
      useOtpLogin({ connectWithEmail, verifyOneTimePassword, retryOneTimePassword })
    );

  beforeEach(() => {
    connectWithEmail.mockResolvedValue(undefined);
    verifyOneTimePassword.mockResolvedValue(undefined);
    retryOneTimePassword.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it("advances to the OTP step after sending a valid email", async () => {
    const { result } = setupHook();

    act(() => result.current.setEmail(" user@example.com "));

    await act(async () => {
      await result.current.actions.submitEmail();
    });

    expect(connectWithEmail).toHaveBeenCalledWith("user@example.com");
    expect(result.current.state.loginStep).toBe("otp");
    expect(result.current.state.infoMessage).toContain("user@example.com");
    expect(result.current.state.error).toBeNull();
  });

  it("verifies the OTP and surfaces confirmation text", async () => {
    const { result } = setupHook();

    act(() => {
      result.current.setEmail("user@example.com");
      result.current.setOtp("123456");
    });

    await act(async () => {
      await result.current.actions.submitEmail();
    });

    await act(async () => {
      await result.current.actions.verifyOtp();
    });

    expect(verifyOneTimePassword).toHaveBeenCalledWith("123456");
    expect(result.current.state.infoMessage).toContain("Finalizing");
    expect(result.current.state.error).toBeNull();
  });

  it("allows resending the code and updates status text", async () => {
    const { result } = setupHook();

    act(() => result.current.setEmail("user@example.com"));

    await act(async () => {
      await result.current.actions.resendCode();
    });

    expect(retryOneTimePassword).toHaveBeenCalled();
    expect(result.current.state.infoMessage).toContain("user@example.com");
  });
});
