# Banakar FinClub Live Setup

## 1. Web/PWA Hosting

The app is ready for GitHub Pages.

1. Open `https://github.com/Manjunathbscloud/banaFinClub/settings/pages`.
2. Under **Build and deployment**, choose **GitHub Actions**.
3. Open **Actions** and run `Deploy Web App`, or push to `main`.
4. The expected URL is:

```text
https://manjunathbscloud.github.io/banaFinClub/
```

## 2. Shared Backend

For shared member login and live data, create a free Supabase project.

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `docs/supabase-schema.sql`.
4. Copy:
   - Project URL
   - anon public key
5. Add those values to the app config in the next implementation step.

## 3. Suggested Auth Approach

Supabase email/password auth is easiest and free. Since members want phone + password, the app can convert phone numbers to private login emails internally:

```text
9000000001@banakar-finclub.local
```

Members still see and type only phone + password.

## 4. Next Implementation Step

After the Supabase URL and anon key are available, update the app so:

- Signup creates a pending Supabase auth user and profile.
- Login reads from Supabase instead of local demo data.
- Admin approval changes profile status from `pending` to `active`.
- Deposits, loans, repayments, and statement rows are stored in Supabase.
