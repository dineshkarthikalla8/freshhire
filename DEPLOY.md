Firebase deployment and server-side payment verification

1. Set Firebase project and login locally:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
```

2. Set Razorpay credentials for Functions (do NOT commit secrets):

```bash
firebase functions:config:set razorpay.key_id="your_key_id" razorpay.key_secret="your_key_secret"
```

3. Deploy (build + deploy functions and hosting):

```bash
npm ci
cd functions && npm ci
npm run build
firebase deploy --only hosting,functions
```

4. CI: create a GitHub secret `FIREBASE_TOKEN` (run `firebase login:ci` locally to get a token) and set `.firebaserc` project value or set `FIREBASE_PROJECT_ID` in workflow.

Notes:
- The functions endpoints `/createOrder` and `/verifyPayment` are proxied via `firebase.json` rewrites to the `api` function.
- Ensure `VITE_RAZORPAY_KEY_ID` is set in the hosting environment variables in Firebase Hosting (or use the key id in `.env` during local dev).
