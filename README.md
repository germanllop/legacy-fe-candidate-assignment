# Web3 Message Signer & Verifier

This repository contains a Dynamic.xyz headless authentication demo with a React + Vite frontend and an Express + TypeScript backend. Users sign in via email OTP, sign arbitrary messages with their Dynamic-connected wallet, and the backend verifies the signature with `ethers`. Prior signatures persist locally per wallet address.

## Project Highlights
- **Headless Dynamic flow**: OTP login implemented via the SDK hooks only; no hosted widget UI is shown unless the wallet itself requires approval.
- **Message verification service**: Backend exposes a single `/api/verify-signature` endpoint that recovers the signer and reports validity.
- **Local history**: Each wallet’s signed-and-verified messages are cached in `localStorage` and replayed after reconnecting.
- **Testable architecture**: Complex bits (OTP flow, storage, signing) are wrapped in hooks/services so behavior can be unit tested without rendering the full UI.

## Tech Stack
- **Frontend**: Vite, React 19, TypeScript, shadcn/ui, Dynamic SDK, Testing Library + Vitest.
- **Backend**: Express, TypeScript, `ethers` for recovery, Zod for validation and Jest for unit testing.

## FRONTEND DEMO URL
[https://assignment-frontend-app-sf7gf.ondigitalocean.app/](https://assignment-frontend-app-sf7gf.ondigitalocean.app/)

## BACKEND DEMO API URL
[https://assignment-backend-app-8qlf4.ondigitalocean.app/](https://assignment-backend-app-8qlf4.ondigitalocean.app/)

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev
# production build
npm run build
npm start
```
The API listens on `http://localhost:3000` by default. Configure credentials via `backend/.env` if needed.

### Frontend
```bash
cd frontend
npm install
npm run dev
# production build
npm run build
npm run preview
```
Create `frontend/.env` (see `.env.example`) and point `VITE_DYNAMIC_XYZ_ID` plus `VITE_API_URL` at your Dynamic project and local API.

## Testing

### Frontend
Tests live alongside the source they cover. From `frontend/` run:
```bash
npm run test
```
Coverage includes:
- `shortWalletAddress` utility guards (only accepts 42-char addresses).
- Storage helpers for per-wallet history (`src/lib/storage.ts`).
- `useOtpLogin` and `useSignedMessages` hooks.
- Integration-style specs for `SignMessage` and `ConnectWallet` components using mocked Dynamic hooks.

### Backend
Jest unit tests cover the verification controller/service (`backend/tests/*`). From `backend/` run:
```bash
npm run test
```

## Design & Architectural Notes
- **Headless-first**: Authentication is driven via Dynamic hooks (`useConnectWithOtp`, `useIsLoggedIn`). Wallet signing leverages `primaryWallet.signMessage` so everything stays headless except for unavoidable wallet prompts.
- **Logic isolation**: OTP and signing flows were moved into hooks (`useOtpLogin`, `useSignedMessages`) to simplify testing and allow future screens to reuse the same state machines.
- **Persistence trade-off**: For this scope, `localStorage` is enough to maintain per-wallet histories. If multiple providers or contexts are needed later, introducing a small storage abstraction (e.g., Zustand, jotai, or even IndexedDB via Dexie) would avoid re-implementing serialization.
- **API client separation**: `src/lib/api/signature.ts` keeps fetch logic out of components, so migrating to Axios or a typed client later won’t touch the UI layer.

## Potential Improvements
- **Richer storage layer**: Swap the simple helper for a dedicated storage library to support syncing across tabs, encryption, or multiple Dynamic contexts/providers.
- **Multi-wallet support**: Promote `useSignedMessages` into a context that can handle multiple connected wallets simultaneously (Dynamic allows multi-wallet sessions).
- **Server persistence**: If shared history is required, add a database and move the storage boundary behind an API, keeping the current hook signatures intact.
- **E2E coverage**: Add a Playwright smoke test that drives the full login/sign/verify flow against a mocked backend for extra safety.
- **Security hardening**: Implement headless MFA and rate limiting on the verification endpoint if this evolves beyond a demo.

This setup aims to stay approachable while still demonstrating production-minded patterns—clean separation, typed APIs, and a test suite that proves the critical paths.
