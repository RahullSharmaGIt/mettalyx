# Metallyx — Security, Bugs & Scalability Audit

> Audit scope: authentication layer, all server actions (`actions/`), all API routes (`app/api/`), Prisma schema, OEM / Vendor / Admin dashboards, landing & onboarding UI, and infrastructure files (`next.config.ts`, `docker-compose.yml`, `.env`).
>
> Stack at time of audit: **Next.js 16 · React 19 · next-auth v5 · Prisma 6 · PostgreSQL · S3**.

---

## Executive Summary

| Category | Critical | High | Medium | Low | Total |
|---|---:|---:|---:|---:|---:|
| Security | 6 | 10 | 8 | 3 | **27** |
| Functional bugs | — | — | — | — | **14** |
| Visible / UI / UX bugs | — | — | — | — | **13** |
| Scalability | — | — | — | — | **13** |
| **Total** | | | | | **67** |

Severity legend:
- **Critical** — fix this week; exploitable or customer-visible data loss.
- **High** — fix this sprint; real risk at normal traffic.
- **Medium** — fix next sprint; degrades at scale or under contention.
- **Low** — backlog; polish, hygiene, defense-in-depth.

---

## 1. Security Vulnerabilities

### 1.1 Critical

**S-C1. AUTH_SECRET present on disk in plaintext `.env`**
[.env](.env) — `AUTH_SECRET=8c7abad54e…` is readable by anything with FS access. File IS in `.gitignore`, so not in git, but still leaks via backups, logs, CI snapshots.
*Impact:* anyone holding the secret can forge JWTs and impersonate any role (admin/OEM/vendor).
*Fix:* rotate immediately; move to a secret manager (AWS Secrets Manager / Doppler / Vault).

**S-C2. Default admin password hardcoded in seed**
[prisma/seed.ts:10](prisma/seed.ts#L10) — `admin123` is hashed at seed time but the plaintext lives in source history forever.
*Impact:* anyone with repo access can log in as admin on any env that was seeded.
*Fix:* read initial admin creds from env vars; fail the seed if unset in production.

**S-C3. No rate limiting on login / registration**
[auth.ts](auth.ts) Credentials provider, [actions/register.ts](actions/register.ts), [actions/login.ts](actions/login.ts).
*Impact:* unlimited credential stuffing / brute force; no lockout.
*Fix:* add `@upstash/ratelimit` (or equivalent) keyed by IP+email — 5 attempts / 5 min.

**S-C4. IDOR in vendor `acceptJob` action**
[app/vendor/jobs/actions.ts:8-35](app/vendor/jobs/actions.ts) — accepts any `jobId` from any authenticated vendor; does not verify the job was actually assigned to the caller's vendor profile.
*Impact:* a vendor can claim another vendor's awarded job.
*Fix:* `where: { id: jobId, vendorId: session.user.vendorProfileId, status: "ASSIGNED" }` on the update.

**S-C5. No role-based authorization in middleware**
[proxy.ts](proxy.ts) — only gates logged-in vs anonymous; a VENDOR session can request `/admin/*` or `/oem/*` pages. Page-level checks are inconsistent, so some SSR pages render admin data to the wrong role.
*Impact:* privilege escalation by URL change.
*Fix:* in `proxy.ts`, read `token.role` and reject mismatched role prefixes before the page renders.

**S-C6. Race condition in `awardJob` transaction (no isolation level)**
[actions/award-job.ts:27-70](actions/award-job.ts) — multi-write transaction uses default READ COMMITTED; two concurrent awards on the same job can both succeed and corrupt bid state.
*Impact:* double-award, inconsistent `Bid.status`.
*Fix:* `prisma.$transaction(async tx => {…}, { isolationLevel: "Serializable" })` + `SELECT … FOR UPDATE` on the job row.

### 1.2 High

**S-H1. Weak password policy (min 6 chars, no complexity)** — [schemas/index.ts:17-18](schemas/index.ts#L17-L18). *Fix:* `min(12)` + require letters + digits.

**S-H2. No explicit session `maxAge` / idle timeout** — [auth.ts:18](auth.ts#L18) — JWT strategy defaults to 30 days. *Fix:* `session: { maxAge: 8*60*60, updateAge: 60*60 }`.

**S-H3. Open redirect via `callbackUrl`** — [proxy.ts:46-51](proxy.ts#L46-L51) — `callbackUrl` query param echoed back without validation. *Fix:* only allow `startsWith('/')` and reject `//`, `http:`, `https:` prefixes.

**S-H4. File-download authorization too permissive for vendors** — [app/api/files/[fileId]/download/route.ts:72-76](app/api/files/[fileId]/download/route.ts) — any vendor can download if job status is in a broad set; ownership not checked. *Fix:* restrict to `job.vendorId === session.user.vendorProfileId` (plus OEM owner + admin).

**S-H5. Presigned-upload endpoint trusts client `mimeType` / `size`** — [app/api/files/presign-upload/route.ts](app/api/files/presign-upload/route.ts) — no MIME allow-list, no max-size clamp, object key derived from client input.
*Impact:* malware upload, S3 key collision, billing abuse.
*Fix:* server-side allow-list (`application/pdf`, CAD, images), `Content-Length` condition ≤ 25 MB, random UUID key.

**S-H6. No CSRF protection on custom API routes** — all `app/api/**/route.ts` rely on NextAuth session cookies but have no CSRF token / origin check. NextAuth protects only its own endpoints.
*Fix:* verify `Origin`/`Referer` against `NEXTAUTH_URL` in a shared `lib/csrf.ts` guard.

**S-H7. No admin audit log** — [app/admin/oem/actions.ts](app/admin/oem/actions.ts) — approve/reject/unlock have no dedicated log. `JobStatusLog` doesn't capture admin identity for non-status actions.
*Fix:* add `AdminAuditLog(id, adminId, action, targetId, payload, createdAt)`.

**S-H8. Verbose error payloads leak internals** — [app/api/files/confirm/route.ts:109](app/api/files/confirm/route.ts#L109) returns raw DB error strings. *Fix:* log full error server-side, return `{ error: "Internal error" }` with a request id.

**S-H9. Bid submit doesn't enforce vendor `VERIFIED` status** — [actions/vendor-bids.ts:73-114](actions/vendor-bids.ts#L73-L114). *Fix:* check `vendorProfile.status === "VERIFIED"` before upsert.

**S-H10. Non-functional quotation edit page** — [app/vendor/jobs/[id]/edit/page.tsx:126-140](app/vendor/jobs/[id]/edit/page.tsx#L126-L140) has hardcoded `defaultValue="12450.00"` and no form/action. Treat as security-adjacent because it implies an auth'd action that silently no-ops. *Fix:* wire to `updateBid` action or remove the page.

### 1.3 Medium

**S-M1. XSS risk on user-generated strings** — job descriptions, company names, bid notes rendered without sanitization. *Fix:* `DOMPurify` on any `dangerouslySetInnerHTML`; otherwise keep strict plaintext.
**S-M2. Missing security headers** — [next.config.ts](next.config.ts) has no HSTS / CSP / X-Frame-Options. *Fix:* add `headers()` in `next.config.ts`.
**S-M3. Unbounded arrays in onboarding** — [app/api/vendor/onboarding/route.ts:114-133](app/api/vendor/onboarding/route.ts#L114-L133). *Fix:* `z.array(z.string()).max(50)` per field.
**S-M4. Race on vendor profile PUT** — [app/api/vendor/profile/route.ts:71-84](app/api/vendor/profile/route.ts#L71-L84). *Fix:* optimistic lock on `updatedAt`.
**S-M5. No JSON parse guard** — [app/api/files/confirm/route.ts:39](app/api/files/confirm/route.ts#L39) crashes 500 on malformed body. *Fix:* try/catch → 400.
**S-M6. Integer overflow / unbounded quantity** — [actions/post-job.ts:48](actions/post-job.ts#L48) `parseInt` with no upper bound. *Fix:* zod `max(100000)`.
**S-M7. Long-lived IAM user S3 credentials** — [lib/s3.ts](lib/s3.ts) driven by static env keys. *Fix:* move to IAM role / STS.
**S-M8. Nominatim User-Agent violates policy** — [lib/geocoding.ts:22](lib/geocoding.ts#L22). *Fix:* add contact email to User-Agent string.

### 1.4 Low

**S-L1.** Commented-out legacy code in [actions/login.ts:1-66](actions/login.ts#L1-L66) — delete.
**S-L2.** No Prisma query log in dev — [lib/prisma.ts](lib/prisma.ts). Add `log: ["error","warn"]`.
**S-L3.** No comment marking `JobStatusLog` in [prisma/schema.prisma](prisma/schema.prisma) as immutable — add.

---

## 2. Functional Bugs

**F-1. Money math uses JS floats** — [app/admin/jobs/[id]/page.tsx:192-201](app/admin/jobs/[id]/page.tsx#L192-L201) computes `(target - bid)/target*100` with floats. Rounding drift compounds over invoices. *Fix:* store prices as integer paise; use `decimal.js` for display math.

**F-2. Timezone ambiguity on `Job.deadline`** — [schemas/index.ts:46](schemas/index.ts#L46), [prisma/schema.prisma:139](prisma/schema.prisma#L139) use `DateTime` without `@db.Timestamptz`. Vendors in IST see different deadlines than UTC storage. *Fix:* switch to `@db.Timestamptz`; render in user locale.

**F-3. Submit-bid modal does not close on success** — [components/vendor/submit-bid-modal.tsx:57](components/vendor/submit-bid-modal.tsx#L57) calls `router.refresh()` only. *Fix:* `setOpen(false)` before refresh.

**F-4. Double-submit possible on submit-bid modal** — [components/vendor/submit-bid-modal.tsx:159](components/vendor/submit-bid-modal.tsx#L159) — Enter key bypasses the disabled-button guard. *Fix:* `onSubmit` early-return while `isLoading`.

**F-5. Update-bid price validation is post-submit only** — [components/vendor/update-bid-modal.tsx:56-59](components/vendor/update-bid-modal.tsx#L56-L59). *Fix:* `max={currentPrice}` on input + inline error.

**F-6. Vendor approval has no confirmation dialog** — [app/admin/vendors/page.tsx:65-72](app/admin/vendors/page.tsx#L65-L72); Approve/Reject are raw form submits. *Fix:* confirm dialog before submit.

**F-7. Vendor dashboard shows hardcoded mock data** — [app/vendor/dashboard/page.tsx:64-90](app/vendor/dashboard/page.tsx#L64-L90) — `expiresIn: "48h"`, `wonTime: "2 HOURS AGO"`, `isTopRanked: true` are static. *Fix:* derive from `job.deadline`, `bid.createdAt`, and a real rank query.

**F-8. File upload in onboarding is simulated** — [components/vendor/onboarding/file-upload.tsx](components/vendor/onboarding/file-upload.tsx) creates `https://dummy-storage.com/...` URLs. Will break on real submit. *Fix:* swap to the presigned-S3 flow used in [components/oem/file-dropzone.tsx](components/oem/file-dropzone.tsx).

**F-9. FileDropzone cannot abort mid-upload** — [components/oem/file-dropzone.tsx:69-81](components/oem/file-dropzone.tsx#L69-L81) — XHR has no `abort()` hook; remove-button only works for pending state. *Fix:* store XHR ref, wire abort to remove.

**F-10. Null-safety hole in admin capability matcher** — [app/admin/jobs/[id]/page.tsx:186-188](app/admin/jobs/[id]/page.tsx#L186-L188) assumes `bid.vendor.vendorProfile` exists. Deleted profiles crash the page. *Fix:* guard + filter at query time.

**F-11. Vendor capabilities render unsafe** — [app/admin/vendors/page.tsx:54-57](app/admin/vendors/page.tsx#L54-L57) can render `[object Object]`. *Fix:* narrow type before `join(", ")`, fallback `"—"`.

**F-12. Award dialog uses `alert()`** — [components/admin/award-job-dialog.tsx:74,78](components/admin/award-job-dialog.tsx) — breaks flow, bypasses error handling. *Fix:* toast notification.

**F-13. Job approval dialog silently fails validation** — [components/admin/job-approval-dialog.tsx:30](components/admin/job-approval-dialog.tsx#L30) returns with no user feedback. *Fix:* inline error text below inputs.

**F-14. Login form password not cleared on failure** — [components/auth/login-form.tsx:43](components/auth/login-form.tsx#L43). *Fix:* `form.resetField("password")` in the error branch.

---

## 3. Visible / UI / UX Bugs

**U-1. No root-level `error.tsx`** — any unhandled throw = blank screen. *Fix:* add [app/error.tsx](app/error.tsx) with a retry CTA.
**U-2. No root-level `not-found.tsx`** — unstyled 404. *Fix:* add [app/not-found.tsx](app/not-found.tsx).
**U-3. Mobile sidebar close button positioned `-right-12`** — [components/vendor/industrial-sidebar.tsx:110-116](components/vendor/industrial-sidebar.tsx#L110-L116) can land off-screen on narrow viewports. *Fix:* position inside sidebar top-right.
**U-4. Sidebar collapse state not persisted** — [components/oem/SidebarContext.tsx:15](components/oem/SidebarContext.tsx#L15), [components/vendor/industrial-layout-wrapper.tsx:17](components/vendor/industrial-layout-wrapper.tsx#L17). *Fix:* persist to `localStorage`.
**U-5. "View All Active Bids" button is a dead link** — [components/vendor/industrial-bid-pipeline.tsx:107](components/vendor/industrial-bid-pipeline.tsx#L107). *Fix:* make it a `<Link>` or remove.
**U-6. Vendor profile save shows no loading/success feedback** — [components/vendor/profile/profile-page.tsx:65-89](components/vendor/profile/profile-page.tsx#L65-L89). *Fix:* per-section `isSaving` + toast.
**U-7. Empty-state for vendor jobs lacks CTA** — [app/vendor/jobs/page.tsx:48-52](app/vendor/jobs/page.tsx#L48-L52).
**U-8. Textarea for bid-revision reason has no char limit / counter** — [app/vendor/jobs/[id]/edit/page.tsx:137](app/vendor/jobs/[id]/edit/page.tsx#L137). *Fix:* `maxLength={500}` + counter.
**U-9. Status badges rely on color only** — [components/vendor/industrial-bid-pipeline.tsx:43-51](components/vendor/industrial-bid-pipeline.tsx#L43-L51). *Fix:* add icon (Lock / Gift) alongside label.
**U-10. Decorative images carry user-copy alt text** — [app/vendor/jobs/[id]/edit/page.tsx:247-256](app/vendor/jobs/[id]/edit/page.tsx#L247-L256). *Fix:* empty `alt=""` or descriptive text.
**U-11. External DiceBear avatar with no fallback** — [components/vendor/industrial-navbar.tsx:58](components/vendor/industrial-navbar.tsx#L58). *Fix:* `onError` → initials.
**U-12. Escape-on-dirty modal loses unsaved bid revisions** — [components/vendor/update-bid-modal.tsx:116](components/vendor/update-bid-modal.tsx#L116). *Fix:* confirm if dirty.
**U-13. All currency hardcoded `₹`, all copy English-only** — marketplace will need i18n / multi-currency before market expansion. Track as backlog.

---

## 4. Scalability Issues

### 4.1 Unbounded queries / missing pagination

**SC-1. Admin OEM jobs page fetches ALL jobs** — [app/admin/oem/page.tsx:37-45](app/admin/oem/page.tsx#L37-L45) uses `findMany()` with no `take`, then filters `PENDING_REVIEW` in JS. At 100k jobs ≈ unusable. *Fix:* push filter into `where`, add `take: 50` with cursor.
**SC-2. Vendor bidding page fetches ALL open jobs with ALL bids** — [actions/vendor-bids.ts:27-48](actions/vendor-bids.ts#L27-L48). *Fix:* cursor pagination; use `_count` for bid counts.
**SC-3. Admin job detail fetches every VERIFIED vendor** — [app/admin/jobs/[id]/page.tsx:72-79](app/admin/jobs/[id]/page.tsx#L72-L79) to score a handful. *Fix:* pre-filter by capability in the query; limit to top N.

### 4.2 Missing / suboptimal indexes — [prisma/schema.prisma](prisma/schema.prisma)

| Table | Missing index | Query it speeds up |
|---|---|---|
| `Job` | `@@index([status, createdAt])` | open-jobs feed, admin review list |
| `Job` | `@@index([oemId, status])` | OEM dashboard |
| `Job` | `@@index([deadline])` | deadline reminders |
| `Bid` | `@@index([unlockRequested, updatedAt])` | admin unlock queue |
| `Bid` | `@@index([vendorId, status])` | vendor "my bids" |
| `VendorProfile` | `@@index([status, isOnboarded])` | admin verified-vendor filter |
| `VendorProfile` | `@@index([city])` | geographic match |
| `VendorCapability` | `@@index([vendorId])` | per-vendor capability lookup |
| `FileAccessLog` | `@@index([jobId, accessedAt])` | per-job audit |
| `FileAccessLog` | `@@index([userId, accessedAt])` | per-user audit |

### 4.3 Query-shape problems

**SC-4. In-memory filter on admin OEM page** — JS `.filter()` after `findMany()` (duplicates SC-1). *Fix:* move filter to `where`.
**SC-5. Naive capability matcher** — [app/admin/jobs/[id]/page.tsx:82-91](app/admin/jobs/[id]/page.tsx#L82-L91) does substring match on every vendor client-side. *Fix:* pre-compute matching vendors in the query (JSON filter / `has`).
**SC-6. No `_count` or aggregation usage** — bid counts, job counts rendered by fetching whole rows. *Fix:* `prisma.*.count()` or `{ _count: true }` in `include`.

### 4.4 Transaction / concurrency

**SC-7. Default isolation on award transaction** — see S-C6. Use `Serializable` + row lock.
**SC-8. Race on vendor profile PUT** — see S-M4. Optimistic concurrency.
**SC-9. `submitBid` not wrapped in `$transaction`** — [actions/vendor-bids.ts:94-113](actions/vendor-bids.ts#L94-L113) — future additions will race. *Fix:* wrap in `prisma.$transaction`.

### 4.5 Caching / invalidation

**SC-10. No `revalidateTag` strategy** — actions call `revalidatePath` per route, so job counts in sidebars go stale. *Fix:* tag reads (`jobs`, `job-${id}`, `vendor-${id}`) and invalidate by tag in mutations.
**SC-11. No ISR / `fetch` cache config** — dashboards re-query Postgres on every request. *Fix:* add `revalidate` or segment-level `revalidateTag`.

### 4.6 Schema

**SC-12. No soft-delete on `Job` / `Bid`** — status-only deletion loses who/when. *Fix:* add `deletedAt DateTime?`; filter `deletedAt: null` in reads.
**SC-13. `JobStatusLog` not partitioned or TTL'd** — append-only table grows without bound. *Fix:* archive rows > 12 months to cold storage.

---

## 5. Remediation Roadmap

| Sprint | Theme | Items |
|---|---|---|
| **1** | Auth & authorization | S-C1 · S-C2 · S-C3 · S-C4 · S-C5 · S-C6 · S-H1 · S-H2 · S-H3 · S-H4 · F-6 · F-10 |
| **2** | Data integrity | F-1 · F-2 · S-M4 · SC-7 · SC-8 · SC-9 |
| **3** | Scale-critical queries | SC-1 · SC-2 · SC-3 · SC-4 · SC-5 · SC-6 · all indexes in §4.2 |
| **4** | UX polish + hardening | U-1..U-5 · F-3 · F-4 · F-5 · F-7 · F-8 · F-9 · F-12 · F-13 · F-14 · S-M1..M8 |
| **5** | Observability & backlog | S-H5 · S-H6 · S-H7 · S-H8 · S-H9 · S-H10 · S-L1..L3 · U-6..U-13 · SC-10..SC-13 |

Each sprint item should become a tracked ticket. Prefer one PR per finding where the blast radius is small; bundle index additions into a single migration PR.

---

## 6. Appendix

### A. Recommended libraries

| Need | Suggested pick | Notes |
|---|---|---|
| Rate limiting | `@upstash/ratelimit` + Upstash Redis | serverless-friendly |
| Toast notifications | `sonner` or `react-hot-toast` | replaces `alert()` calls in F-12 |
| Decimal math | `decimal.js` | required for F-1 fix |
| HTML sanitization | `isomorphic-dompurify` | S-M1 |
| Security headers | built-in `next.config.ts → headers()` | no new dep needed |
| Test DB / integration | `@testcontainers/postgresql` | to cover auth & RBAC paths |

### B. Secret rotation checklist (for S-C1)

1. Generate new `AUTH_SECRET` (`openssl rand -hex 32`).
2. Write it to the secret manager (not `.env`).
3. Deploy with new value; all sessions invalidate.
4. Verify login still works for an admin, an OEM, and a vendor.
5. Remove old value from `.env` in all dev machines.

### C. Index migration template

```prisma
// prisma/schema.prisma — add alongside existing @@index declarations
model Job {
  // …existing fields…
  @@index([status, createdAt])
  @@index([oemId, status])
  @@index([deadline])
}

model Bid {
  @@index([unlockRequested, updatedAt])
  @@index([vendorId, status])
}

model VendorProfile {
  @@index([status, isOnboarded])
  @@index([city])
}

model VendorCapability {
  @@index([vendorId])
}

model FileAccessLog {
  @@index([jobId, accessedAt])
  @@index([userId, accessedAt])
}
```

Run `npx prisma migrate dev --name add_scale_indexes` after adding.

### D. Out of scope for this audit

- Performance profiling of React render paths (requires runtime traces).
- Penetration testing against a live environment.
- Mobile native app (none exists).
- Third-party S3 bucket policy review (needs AWS console access).

---

*Audit produced from a static read of the repo at commit `1b15e43`. Re-run before each release; line numbers drift.*
