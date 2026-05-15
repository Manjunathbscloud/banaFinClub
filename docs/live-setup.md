# Banakar FinClub Live Setup

## 1. Web/PWA Hosting

The app is ready for GitHub Pages as an installable PWA. This is the preferred path for testing because UI/code updates can be deployed without rebuilding an APK.

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

1. Members sign up with name, phone number, and password only.
2. The app validates a proper 10-digit mobile number.
3. The president phone number `9591382942` is active immediately after signup.
4. Other members stay pending until the president/admin approves them.
5. Members login with phone + password.
6. Deposits, loans, approvals, and statement imports are shared across all phones.

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

For web/PWA deployments, push the change to `main` and let GitHub Pages deploy. For APK deployments, rebuild:

```bash
npx cap sync android
cd android
./gradlew assembleDebug
```

## 5. Auth Approach

Supabase email/password auth is free. Members never type email. The president phone is mapped to the president email internally; other members use a private internal login ID behind the scenes:

```text
9591382942 -> manjunathbs.cloud@gmail.com
```

Members still see and type only phone + password.
