# Security Specification & Threat Model - Fakta Faktual Portal

This document outlines the security architecture, invariants, and threat vectors for the Firestore database layer of the PT Fakta Media Nusantara news portal.

## 1. Data Invariants

- **Articles**:
  - `id` must match pattern `^art-[a-zA-Z0-9_\-]+$`.
  - `title`, `content`, and `category` are non-empty strings.
  - `status` must be one of: `draft`, `scheduled`, `published`.
  - `views` must be an integer >= 0.

- **Comments**:
  - `id` must match pattern `^com-[a-zA-Z0-9_\-]+$`.
  - `articleId` must reference a valid article ID starting with `art-`.
  - `status` must be one of: `pending`, `approved`, `rejected`.
  - `content` must be a string with size <= 2000 characters.

- **Settings**:
  - Single document `main` containing critical brand representations.
  - `websiteName` and `companyName` are immutable under standard user contexts.

- **Editorial Members**:
  - `id` must match `^e-[a-zA-Z0-9_\-]+$`.

- **Subscriptions**:
  - `id` must match `^TX-[0-9]+$`.
  - `amount` must be a positive integer.

---

## 2. The "Dirty Dozen" Poison Payloads

The following payloads attempt to bypass structure, type, or process flow controls.

1. **ID Injection Poisoning**: An article with document ID `/articles/junk-payload%..%///` with massive nested folders.
2. **Ghost Admin Promotion**: A user updating their own profile payload from `{ "role": "user" }` to `{ "role": "admin" }`.
3. **Immortality Reset**: Overwriting a previously set `createdAt` timestamp with an arbitrarily chosen client-provided date in the past.
4. **State Shortcut**: Transitioning a comment's `status` directly from `pending` to `approved` via guest context without moderation verification data.
5. **Recursive Denial-of-Wallet (DoW)**: Sending strings of 10MB in `content` nested fields.
6. **Self-Appointed Subscription**: Bypassing NusaPay Gateway and manually saving a `Subscription` with `{ "amount": 0, "plan": "unlimited_free" }`.
7. **Negative Traffic Injection**: Updating `views` to `-500000` to break the analytic display boards.
8. **Shadow Article Fields**: Writing `{ "title": "...", "isVerifiedPremium": true, "extraShadowField": "leak" }` to pollute standard schema definitions.
9. **Relational Sync Break**: Posting a comment where `articleId` points to a non-existent thread `art-fake-abc`.
10. **SQL/NoSQL Structural Collateral Hijacking**: Putting nested Firestore map payloads in place of strings.
11. **XSS Payload Infiltration**: Writing script triggers `<script>alert('xss')</script>` directly in the content string.
12. **System-Only Fields Hijacking**: Modifying the AI-generated `aiModerationScore` or `aiReason` by standard client writes.

---

## 3. Rules Implementation Strategy

Every incoming write and read is guarded by strict schema, identity, and relational synchronizations matching these invariants.
