# Banakar FinClub

Banakar FinClub is a private Android/PWA finance app for family fund management.

## Current Features

- Phone + password demo login
- Member signup with admin approval
- Forgot password placeholder for backend OTP integration
- English/Kannada language toggle
- Admin and member dashboards
- Monthly deposits with December concession rules
- Historical 5-year deposit summary
- Loan request and approval flow
- Monthly loan interest calculation at 1.25%
- ICICI statement CSV import starter
- Capacitor Android project for APK builds
- GitHub Pages web/PWA deployment workflow
- Supabase-ready live backend config file

## Demo Login

```text
Phone: 9000000001
Password: 123456
```

## Run Locally

```bash
npm install
npm start
```

## Host Web/PWA Version

This repo includes a GitHub Pages workflow that deploys the `www/` folder.

In GitHub:

1. Open repository settings.
2. Go to **Pages**.
3. Set **Build and deployment** source to **GitHub Actions**.
4. Push to `main` or run the `Deploy Web App` workflow manually.

Expected web URL:

```text
https://manjunathbscloud.github.io/banaFinClub/
```

## Configure Live Backend

The app currently runs in demo mode until `www/config.js` is changed:

```js
window.BANAKAR_FINCLUB_CONFIG = {
  backend: "supabase",
  supabaseUrl: "https://your-project.supabase.co",
  supabaseAnonKey: "your-public-anon-key",
};
```

## Build Debug APK

```bash
npx cap sync android
cd android
JAVA_HOME=/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home \
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools \
ANDROID_SDK_ROOT=/opt/homebrew/share/android-commandlinetools \
./gradlew assembleDebug
```

The debug APK is generated at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Next Steps

- Connect real backend authentication and shared database.
- Add real OTP/password reset.
- Replace demo local storage with Supabase/Firebase/Apps Script backend.
- Add ICICI statement file upload parser after sample statement is provided.
- Create a signed release APK for production sharing.

See:

- [Live setup](docs/live-setup.md)
- [Supabase schema](docs/supabase-schema.sql)
