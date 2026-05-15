# Banakar FinClub Live Setup

## 1. Web/PWA Hosting

The app is ready for GitHub Pages, but it can also run only as an APK. GitHub Pages is optional.

Expected web URL if Pages is enabled:

```text
https://manjunathbscloud.github.io/banaFinClub/
```

## 2. Shared Backend

For shared member login and live data, create a free Supabase project.

1. Create a Supabase project.
2. Open **Authentication > Providers > Email**.
3. Turn off **Confirm email** for this private family app.
4. Open SQL Editor.
5. Run `docs/supabase-schema.sql`.
6. Copy:
   - Project URL
   - anon public key
7. Send those two values to Codex so `www/config.js` can be updated and a new APK can be built.

Do not send the `service_role` key. Only the public `anon` key is needed inside the app.

## 3. Live App Flow

After Supabase is connected:

1. Each seeded member signs up once with their phone and password.
2. Seeded active members claim their existing account automatically.
3. New unknown phone numbers stay pending until the president approves them.
4. Members login with phone + password.
5. Deposits, loans, approvals, and statement imports are shared across all phones.

The seeded first admin is:

```text
Phone: 9591382942
Name: Manjunath Banakar
Role: President
```

## 4. App Config

Update `www/config.js`:

```js
window.BANAKAR_FINCLUB_CONFIG = {
  backend: "supabase",
  supabaseUrl: "https://your-project.supabase.co",
  supabaseAnonKey: "your-public-anon-key",
};
```

Then rebuild the APK:

```bash
npx cap sync android
cd android
./gradlew assembleDebug
```

## 5. Auth Approach

Supabase email/password auth is free. Since members want phone + password, the app converts phone numbers to private login emails internally:

```text
9591382942@banakarfinclub.app
```

Members still see and type only phone + password.
