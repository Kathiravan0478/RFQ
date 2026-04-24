# Backend integration guide (FastAPI + MongoDB)

This frontend is intentionally structured to fit a microservices backend:

- **UI layer**: React components/pages/layout
- **API layer**: Axios + TanStack Query in `src/api/*`

## Base URL + auth header

- **Base URL**: `VITE_API_BASE_URL` (defaults to `http://localhost:8000`) via `src/lib/env.ts`
- **JWT**: `src/api/apiClient.ts` automatically adds:
  - `Authorization: Bearer <token>` when `authStore.token` is present

## Expected data model mapping

The UI expects a backend that can produce these shapes:

- **Users**
  - `userId: string`
  - `role: "Admin" | "Buyer" | "Seller"`
  - `status: "Pending" | "Approved"`
  - `profileData: object`
- **Biding_Events** (Auction events)
  - `eventId: string`
  - `createdBySellerId: string`
  - `rfqName: string`
  - `startTime: ISO string`
  - `bidCloseTime: ISO string`
  - `forcedCloseTime: ISO string`
  - `status: "Draft" | "Live" | "Closed" | "Cancelled"`
- **Bidings** (Bids)
  - `bidId: string`
  - `eventId: string`
  - `buyerId: string`
  - `amount: number`
  - `timestamp: ISO string`

Types live in `src/api/types.ts`.

## HTTP endpoints the frontend will call

### Auth

Implemented in `src/api/auth.ts`.

- `POST /auth/login`
  - Request: `{ email, password }`
  - Response: `{ token, userId, role }`
- `GET /auth/me`
  - Response: `{ userId, role, status }`

### Auctions

Implemented in `src/api/auctions.ts`.

- `GET /auctions?status=Live`
  - Response: `Auction[]`
- `GET /auctions/:eventId`
  - Response: `Auction`
- (optional, to implement later) `POST /auctions` (Seller)
  - Request: `{ rfqName, startTime, bidCloseTime, forcedCloseTime, ... }`

### Bids

Implemented in `src/api/bids.ts`.

- `GET /bids?eventId=:eventId`
  - Response: `Bid[]`
- `POST /bids`
  - Request: `{ eventId, amount }`
  - Response: `Bid`

## Live updates (notifications / “incoming alerts”)

The UI currently simulates alerts and renders them via:

- `src/state/notifications.ts`
- `src/components/NotificationToast.tsx`

When backend is ready, replace the simulation with one of:

- **SSE** (`GET /events/stream`)
- **WebSocket** (`/ws`)
- **Polling** (already used as a placeholder in `useBids()` with `refetchInterval`)

### Recommended event payloads

These map well to the toast UI:

- `BID_PLACED`: `{ eventId, bidId, amount, buyerId, timestamp }`
- `AUCTION_EXTENDED`: `{ eventId, bidCloseTime, reason }`
- `AUCTION_CLOSING_SOON`: `{ eventId, bidCloseTime }`

## Cron/extension logic (backend-owned)

The frontend does **not** implement extension logic; it only displays the authoritative times from the backend.

Backend service (e.g., APScheduler or AWS EventBridge + Lambda) should:

- Monitor remaining time to `bidCloseTime`
- If **a new bid or rank change occurs** within a trigger window \(X\):
  - Extend `bidCloseTime = now + Y minutes`
  - Ensure `bidCloseTime <= forcedCloseTime`

Frontend impact:

- `AuctionDetailsPage` should display updated `bidCloseTime`
- Live bid list should update via SSE/WS/polling

## Async messaging system (mail service)

Upon every successful bid insert (`POST /bids`), backend should emit an async event to the mail service:

- e.g., queue message: `BID_PLACED`
- mail service notifies subscribed users (SES recommended)

Frontend expectation:

- Notifications can be surfaced in the UI when events are pushed (WS/SSE)

