# Biometric ATM System — Backend API

Base URL: `http://localhost:8000`

## User Credentials (For Testing)

### Users & Fingerprint IDs
| User Name | Fingerprint ID | PIN(s) | Account Numbers | Banks |
|-----------|----------------|--------|------------------|-------|
| **Pranali bagul** | `fingerprint_pranali` | 1234 | 1001234567, 1001234570 | SBI, HDFC |
| **Harshada Panchal** | `fingerprint_harshada` | 5678 | 1001234568, 1001234571 | ICICI, AXIS |
| **Gayatri Waghmare** | `fingerprint_gayatri` | 9012 | 1001234572, 1001234574 | AXIS, HDFC |
| **Shubhangi Waghchaure** | `fingerprint_shubhangi` | 3456 | 1001234573, 1001234575 | SBI, ICICI |

### Account Details
- **Pranali**: SBI (₹50,000), HDFC (₹30,000)
- **Harshada**: ICICI (₹75,000), AXIS (₹45,000)
- **Gayatri**: AXIS (₹60,000), HDFC (₹35,000)
- **Shubhangi**: SBI (₹55,000), ICICI (₹40,000)

## Authentication
- Protected endpoints under `/dashboard` require the `fingerprintId` header.
- The middleware validates the header and attaches the authenticated user to the request.
- Example header:
  - `fingerprintId: fingerprint_pranali`

## Health
### GET /health
- Returns server availability.
- Response: `200 OK`
  - Body: `Hello World!` (text)

Example:
```bash
curl -i http://localhost:8000/health
```

## Auth
### POST /auth/verify-fingerprint
- Verifies a user by fingerprint ID.
- Request headers:
  - `Content-Type: application/json`
- Request body:
```json
{ "fingerprintId": "fingerprint_pranali" }
```
- Responses:
  - `200 OK`
    ```json
    {
      "message": "Fingerprint verified",
      "user": {
        "id": 1,
        "name": "Pranali bagul",
        "fingerprintId": "fingerprint_pranali",
        "accounts": [ /* Account[] */ ],
        "transactions": [ /* Transaction[] */ ]
      }
    }
    ```
  - `400 Bad Request` — missing fingerprintId
  - `404 Not Found` — user not found

Example:
```bash
curl -X POST http://localhost:8000/auth/verify-fingerprint \
  -H "Content-Type: application/json" \
  -d '{ "fingerprintId": "fingerprint_pranali" }'
```

## Dashboard (Protected)
Base path: `/dashboard`
Headers required:
- `fingerprintId: <string>`

### GET /dashboard/account-details
- Returns the authenticated user's details, accounts, and transactions.
- Responses:
  - `200 OK`
    ```json
    {
      "message": "User found",
      "user": {
        "id": 1,
        "name": "Pranali bagul",
        "fingerprintId": "fingerprint_pranali",
        "accounts": [ /* Account[] */ ],
        "transactions": [ /* Transaction[] */ ]
      }
    }
    ```
  - `404 Not Found` — user not found

Example:
```bash
curl http://localhost:8000/dashboard/account-details \
  -H "fingerprintId: fingerprint_pranali"
```

### POST /dashboard/account/withdraw
- Withdraws `amt` from the specified `bankName` account of the authenticated user. Requires correct `pin`.
- Request headers:
  - `fingerprintId: <string>`
  - `Content-Type: application/json`
- Request body:
```json
{ "amt": 5000, "bankName": "SBI", "pin": 1234 }
```
- Responses:
  - `200 OK`
    ```json
    { "message": "Withdrawl successful", "user": { /* updated User */ } }
    ```
  - `400 Bad Request` — missing fingerprintId, account not found, insufficient balance, or invalid PIN
  - `404 Not Found` — user not found

Example:
```bash
curl -X POST http://localhost:8000/dashboard/account/withdraw \
  -H "fingerprintId: fingerprint_pranali" \
  -H "Content-Type: application/json" \
  -d '{ "amt": 5000, "bankName": "SBI", "pin": 1234 }'
```

### POST /dashboard/account/deposit
- Deposits `amt` into the specified `bankName` account of the authenticated user.
- Request headers:
  - `fingerprintId: <string>`
  - `Content-Type: application/json`
- Request body:
```json
{ "amt": 20000, "bankName": "HDFC" }
```
- Responses:
  - `200 OK`
    ```json
    { "message": "Deposit successful", "user": { /* updated User */ } }
    ```
  - `400 Bad Request` — missing fingerprintId or amount
  - `404 Not Found` — user not found
  - `400 Bad Request` — account not found

Example:
```bash
curl -X POST http://localhost:8000/dashboard/account/deposit \
  -H "fingerprintId: fingerprint_pranali" \
  -H "Content-Type: application/json" \
  -d '{ "amt": 20000, "bankName": "HDFC" }'
```

### POST /dashboard/account/transfer
- Transfers `amt` from `senderAccountNO` to `receiverAccountNO`. Requires correct `pin` for the sender account.
- Request headers:
  - `fingerprintId: <string>`
  - `Content-Type: application/json`
- Request body:
```json
{
  "senderAccountNO": "1001234567",
  "receiverAccountNO": "1001234568",
  "amt": 5000,
  "pin": 1234
}
```
- Responses:
  - `200 OK`
    ```json
    {
      "message": "Transfer successful",
      "senderAccountNo": "1001234567",
      "receiverAccountNo": "1001234568",
      "transaction": {
        "id": 123,
        "type": "transfer",
        "fromAccountNumber": "1001234567",
        "toAccountNumber": "1001234568",
        "amount": 5000,
        "userId": 1,
        "createdAt": "..."
      }
    }
    ```
  - `400 Bad Request` — missing sender/receiver/account numbers, missing PIN, invalid PIN, or insufficient balance
  - `404 Not Found` — accounts not found

Example:
```bash
curl -X POST http://localhost:8000/dashboard/account/transfer \
  -H "fingerprintId: fingerprint_pranali" \
  -H "Content-Type: application/json" \
  -d '{ "senderAccountNO": "1001234567", "receiverAccountNO": "1001234568", "amt": 5000, "pin": 1234 }'
```

### GET /dashboard/account/statement/:accountNumber
- Returns transactions for the user owning `:accountNumber`.
- Request headers:
  - `fingerprintId: <string>`
- Path params:
  - `accountNumber: string`
- Responses:
  - `200 OK`
    ```json
    { "transactions": [ /* Transaction[] */ ] }
    ```
  - `400 Bad Request` — missing account number
  - `404 Not Found` — account not found

Example:
```bash
curl http://localhost:8000/dashboard/account/statement/1001234567 \
  -H "fingerprintId: fingerprint_pranali"
```

## Data Models
### User
```json
{
  "id": number,
  "name": string,
  "fingerprintId": string,
  "accounts": Account[],
  "transactions": Transaction[],
  "createdAt": string,
  "updatedAt": string
}
```

### Account
```json
{
  "id": number,
  "accountNumber": string,
  "pin": number,
  "balance": number,
  "bankName": "SBI" | "HDFC" | "ICICI" | "AXIS",
  "userId": number,
  "createdAt": string,
  "updatedAt": string
}
```

### Transaction
```json
{
  "id": number,
  "toAccountNumber": string,
  "fromAccountNumber": string,
  "amount": number,
  "createdAt": string,
  "type": "transfer" | "withdraw" | "deposit",
  "userId": number
}
```

## CORS
- Development origin allowed: `http://localhost:8080`
- Methods: `GET, POST, PUT, DELETE, PATCH, OPTIONS`
- Allowed headers include: `Content-Type, Authorization, x-account-number, fingerprintId`
