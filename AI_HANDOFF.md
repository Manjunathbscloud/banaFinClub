# Banakar FinClub - AI Handoff Document

This document is for any AI/developer continuing work on the Banakar FinClub app.

## Project Summary

Banakar FinClub is a private family finance club app. Members make monthly deposits, can request loans, and the president/admin manages approvals and current loan records.

The app is currently built as a static web/PWA app hosted from GitHub Pages. It uses Supabase as the live backend.

## Repository

GitHub repo:

```text
https://github.com/Manjunathbscloud/banaFinClub.git
```

Main app folder:

```text
www/
```

Important files:

```text
www/index.html
www/app.js
www/styles.css
www/config.js
www/service-worker.js
docs/supabase-schema.sql
docs/manual-current-loans.sql
```

## Runtime / Hosting

This is a static frontend app. It can run through GitHub Pages or by opening the built files locally.

Current production style:

- Frontend: static PWA
- Hosting: GitHub Pages
- Backend: Supabase
- Auth: Supabase Auth using phone-number-derived email internally

The app does not depend on Codex or any specific AI tool to run.

## Backend

Backend is Supabase.

Frontend Supabase config is in:

```text
www/config.js
```

This file contains:

- Supabase Project URL
- Supabase anon public key

The anon key is safe for frontend usage. Do not expose or request the Supabase service role key.

## Database Setup

Main schema/reference SQL:

```text
docs/supabase-schema.sql
```

Manual current loan table setup:

```text
docs/manual-current-loans.sql
```

If the current loan feature is not working, run `docs/manual-current-loans.sql` in the Supabase SQL Editor.

## Login / Signup Rules

Users sign up with:

- Name
- Phone number
- Password

Internally, phone numbers are converted into email format for Supabase Auth.

President/admin number:

```text
9591382942
```

President email mapping:

```text
manjunathbs.cloud@gmail.com
```

Normal users must be approved by admin after signup.

## User Roles

Main roles:

- `president`: admin
- `vice_president`
- `member`
- `onboarding`

Only president/admin should manage:

- Signup approvals
- Loan approvals
- Adding current loan records
- Marking loans clear
- Deleting current loan records
- Deleting members

## Current Loan Design

Important: the current loan book is now manual.

Do not import old PDF/CSV loan records directly into the current loan book.

Current loan records should be added by admin through:

```text
Admin -> Add current loan
```

Current loan fields:

- Member name
- Phone number, stored for tracking but hidden from table
- Loan amount
- Auto-calculated monthly interest
- Loan taken date
- Renewal date, entered manually

The current loan book table shows:

- Member
- Loan taken date
- Renewal date
- Loan amount
- Interest/month
- Interest paid
- Status
- Admin actions

Admin actions:

- Mark clear
- Delete

When a loan is marked clear, interest paid is calculated and stored.

## Loan Request Flow

Loan request form is available to all logged-in members in:

```text
Loans -> Loan Request
```

Admin sees pending requests in:

```text
Admin -> Loan approvals
```

Loan request approval and actual current-loan entry are intentionally separate.

## Dashboard Rules

Dashboard is user-specific.

Monthly due must be calculated only for the logged-in user:

```text
monthly due = monthly deposit + that user's current loan interest
```

Monthly deposit is currently:

```text
2000
```

If logged-in user has no active current loan:

```text
interest = 0
monthly due = 2000
```

Admin dashboard should also show admin's own values, not group loan totals.

## UI Notes

The app is being optimized for mobile/PWA usage.

Recent UI rules:

- Login page has only Login and Signup tabs.
- Forgot password is a link inside Login.
- Loans page has collapsible sections:
  - Loan Request
  - Current loan book
- Admin page has collapsible sections:
  - Add current loan
  - Signup approvals
  - Loan approvals
  - Statement import
- Tables should be readable on mobile.
- Avoid making the UI too desktop-like or dense.

## PWA Cache

After frontend changes, bump the cache version in:

```text
www/service-worker.js
```

Example:

```js
const CACHE_NAME = "banakar-finclub-v18";
```

Increase the version so GitHub Pages/PWA users receive the latest files.

## Git Workflow

Before editing:

```bash
git status --short --branch
```

After editing:

```bash
node --check www/app.js
node --check www/service-worker.js
git diff --check
```

Then commit and push:

```bash
git add .
git commit -m "Short clear message"
git push
```

## Things To Avoid

Do not:

- Add old PDF/CSV loans into the current loan book automatically.
- Show phone number in the current loan table.
- Change dashboard monthly due to group totals.
- Remove the member loan request form from the Loans page.
- Put admin-only current loan entry back into the Loans page.
- Expose Supabase service role key.
- Break mobile layout with wide desktop-only tables.

## Current Important Behavior

Current loan book should show only loans manually entered by admin.

Phone number is stored for matching the logged-in member to the loan record.
Do not match current loans by name, because demo/test accounts may share the same name as a real member.

Members should only see their own loans.

Admin can see all current loan records.

## Suggested Next Improvements

Possible future work:

- Add edit option for current loans.
- Add repayment entries for interest/principal month by month.
- Add ICICI statement import once a real statement format is provided.
- Improve password reset flow with Supabase-supported process.
- Add more Kannada translations for newly added labels.
- Add admin reports for monthly collections and loan interest.
