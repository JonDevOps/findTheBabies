# findTheBabies
I want to find the babies mentioned in the Epstein files that was taken away from the autist woman. https://youtu.be/nELNUPooLdk?si=J_NnpIynbImliC9E&t=249

## Website: findthebabies.org

A developing initiative to make trusted missing-child resources easier to find and help communities share information responsibly.

React + Vite single-page site on classic Firebase Hosting (project `studio-578944933-7a8c8`), with Google sign-in, a private `/dashboard`, and Firestore profiles. Admins (custom claim `admin: true`) get an "Admin: member profiles" panel on the dashboard.

```bash
npm install
npm run dev          # local preview
npm run build        # builds dist/ and writes firebase.json
npm run test:rules   # Firestore rules tests (run inside the emulator, see below)
firebase emulators:exec --only firestore "npm run test:rules"
firebase deploy --only hosting,firestore:rules
```

DNS is on Cloudflare; mail is Zoho. `scripts/connect-domains.mjs` only adds the Firebase records and refuses to run if mail records would change.

Split out of the shared `communitySites` project on November 7, 2026.
