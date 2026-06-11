# Mechiee — Fix & Run Guide

## Files in this folder — where each one goes

```
Backend/
  server.js              → replace your Backend/server.js
  .env                   → replace your Backend/.env
  package.json           → replace your Backend/package.json
  controllers/
    authController.js    → NEW — place in Backend/controllers/
  routes/
    authRoutes.js        → NEW — place in Backend/routes/
  middleware/
    authMiddleware.js    → replace your Backend/middleware/authMiddleware.js
  models/
    User.js              → replace your Backend/models/User.js

Frontend_/
  package.json           → replace your Frontend_/package.json
  src/
    utils/
      authApi.js         → replace your Frontend_/src/utils/authApi.js
    services/
      authService.js     → NEW — place in Frontend_/src/services/
```

---

## Step 1 — Fix Firebase API key

Your `firebase.js` has a broken apiKey. Open Firebase Console:
1. Go to Project Settings → Your apps → Web app
2. Copy the fresh config
3. Replace the whole `firebaseConfig` object in `Frontend_/src/config/firebase.js`

The key should look like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (no trailing quote or extra character)

---

## Step 2 — Backend setup

```bash
cd Backend

# Copy files from this fix folder first, then:
npm install

# Start backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

Test it: open browser → http://localhost:5000/
Should show: `Mechiee API Running ✅`

---

## Step 3 — Frontend setup

```bash
cd Frontend_

# Copy files from this fix folder first, then:
npm install

# Start Expo
npx expo start --clear
```

Press `a` to open Android emulator.

---

## Step 4 — Test login flow

1. App opens → WelcomeScreen
2. Select role (Customer / Mechanic)
3. PhoneEntryScreen → enter your real phone number
4. OTP arrives via SMS (Twilio) → enter it
5. Should navigate to HomeScreen

---

## Common errors and fixes

| Error | Fix |
|-------|-----|
| `Cannot find module '../routes/authRoutes'` | You didn't copy authRoutes.js — do step 2 above |
| `OTP not received` | Twilio trial accounts only send to verified numbers. Add your number at twilio.com/console |
| `Network Error` on emulator | Backend not running. Run `npm run dev` in Backend folder first |
| `Firebase: Error (auth/invalid-api-key)` | Fix firebase.js apiKey — see Step 1 |
| `Metro bundler error: firebase-admin` | You have old node_modules. Delete `Frontend_/node_modules` and run `npm install` again |

---

## Twilio trial account note

On a free Twilio account, OTPs only go to **verified** phone numbers.
To verify your number: https://console.twilio.com/us1/develop/phone-numbers/manage/verified