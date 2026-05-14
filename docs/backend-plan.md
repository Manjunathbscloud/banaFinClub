# Banakar FinClub Backend Plan

This first build runs with local demo storage so the app can be tested immediately. For real member logins and shared data, connect a backend before distributing the APK.

## Recommended Free-First Backend

Use Supabase Free:

- `profiles`: member account details and roles.
- `signup_requests`: member signup requests pending admin approval.
- `deposits`: monthly member deposits and yearly renewal fees.
- `loans`: approved loans, disbursement dates, interest status, and outstanding principal.
- `repayments`: principal and interest payments.
- `bank_transactions`: uploaded ICICI statement entries.
- `audit_logs`: every admin change, approval, import, and correction.
- `settings`: monthly deposit, due day, interest rule, annual meeting rules.

## Auth Rules

- Members sign up with phone + password.
- New accounts remain pending until admin approves them.
- Forgot password should use a backend OTP or email reset flow.
- Admin can disable accounts but should not delete financial history.

## Statement Upload Rules

- Import CSV/XLSX/PDF later.
- Keep original narration, debit, credit, balance, transaction date.
- Auto-match known members by UPI name, account holder name, phone, or note.
- Admin reviews unmatched rows before posting.

## APK Build Notes

The app is ready for Capacitor packaging. After installing dependencies:

```bash
npm install
npx cap add android
npx cap sync android
npx cap build android --androidreleasetype APK
```

Android Studio or Android SDK/Gradle tooling may be required for the final APK compile.
