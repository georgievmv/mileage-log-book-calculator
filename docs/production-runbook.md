# Production runbook

Production URL: <https://georgievmv.github.io/mileage-log-book-calculator/>. The physical notebook remains the official record; this application helps operators calculate and total the values copied into it.

## One-time Firebase setup

The workplace owner performs these steps while signed in to the intended Firebase project. Never put the shared-account password in this repository, GitHub, an issue, or a support conversation.

1. Confirm that the project is the dedicated workplace project and that its Cloud Firestore database is in `europe-central2` (Warsaw).
2. In Authentication, keep Email/Password enabled and confirm that the shared operator email is the intended account. Record only its UID in `firestore.rules`; do not record its password.
3. In Authentication > Settings > Authorized domains, add `georgievmv.github.io`. Enter a hostname, not a URL or repository path.
4. In the GitHub repository, set Pages > Build and deployment > Source to **GitHub Actions**.
5. In Settings > Secrets and variables > Actions, create these repository secrets from the Firebase web-app configuration: `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, and `REACT_APP_FIREBASE_APP_ID`.

Firebase web-app configuration identifies the project but does not grant database access. It is nevertheless kept in the build environment to prevent accidental project mixing. Access is enforced by Authentication and `firestore.rules`.

## Deploy security rules

Install and authenticate the Firebase CLI on an authorized maintainer device. Always name the target project explicitly:

```powershell
$env:FIREBASE_PROJECT_ID = "the-dedicated-project-id"
firebase deploy --only firestore:rules --project $env:FIREBASE_PROJECT_ID
```

Before deploying, compare the UID in `firestore.rules` with the shared operator UID shown by Firebase Authentication. If the shared account is replaced, update the UID and redeploy the rules immediately.

### Verify rules before the application release

In Firebase Console, open Firestore Database > Rules and use Rules Playground against a representative `dailyEntries` document path. Run all four checks against the rules that will be published:

1. Simulate **get** with Authentication set to **Unauthenticated**; expect denial.
2. Simulate **create** with Authentication set to **Unauthenticated** and a representative document body; expect denial.
3. Simulate **get** with an authenticated user whose UID is the shared operator UID; expect allowance.
4. Simulate **create** with that same UID and a representative document body; expect allowance. Use a non-production path in the simulator; simulation does not write data.

Also simulate an authenticated UID different from the configured shared UID and expect denial for both read and write. Publish the reviewed rules with the explicit CLI command above, then repeat the unauthenticated production check in a private window before signing in.

## Deploy the application

Every push to `main` runs `.github/workflows/deploy-pages.yml`. A maintainer can also run it manually from Actions > Deploy GitHub Pages > Run workflow. The workflow installs locked dependencies, creates a production build using the configured secrets, and publishes the `build` artifact through GitHub Pages.

For a release:

1. Review the change and run `npm run build` locally with the intended `.env.local` configuration.
2. Push the reviewed commit to `main`.
3. Open the Deploy GitHub Pages workflow and confirm that every step succeeds and that its build uses the intended Firebase project ID.
4. Open the workflow's deployment URL in a private browser window and complete the verification checklist below.

If the build reports missing Firebase configuration, correct the corresponding GitHub Actions secret and rerun the failed workflow. Do not add a production `.env` file to Git.

## Production verification checklist

Use a trusted workplace device and disposable verification records where data changes are required. Clean those records up with the application's confirmed-delete workflow.

- [ ] A private-window visitor sees only the Bulgarian sign-in screen.
- [ ] An unauthenticated Firestore read and write are rejected with `permission-denied`.
- [ ] The shared account signs in, remains signed in after closing and reopening the browser, and signs out successfully.
- [ ] A current-date entry can be calculated, reviewed, and saved.
- [ ] A past-date entry can be saved; a future date and invalid or negative quantities are rejected.
- [ ] Condition distances can overlap, while each condition distance may not exceed total distance.
- [ ] Saving the same vehicle and date shows the update warning and the confirmed update appears in the monthly log.
- [ ] The monthly view filters by vehicle and month, orders dates chronologically, and displays every input and recorded fuel component.
- [ ] Daily totals equal the sum of their displayed three-decimal fuel components, and monthly totals equal the displayed daily values.
- [ ] Editing prefills the calculator and requires recalculation and explicit saving.
- [ ] Deleting identifies the vehicle and date, requires confirmation, and immediately updates the monthly totals.
- [ ] While offline, a save shows that synchronization is pending; after reconnecting, the indication clears and another trusted device receives the change.
- [ ] Bulgarian labels, loading and empty states, confirmations, successes, and recoverable read/write errors are understandable.

Record the date, deployed commit, device/browser, and result of the checklist in the workplace's normal release record. Do not put credentials or production record contents in that record.

## Routine operation and recovery

- Use the application only on trusted workplace devices because authentication and offline Firestore data persist locally.
- Use Logout before a device leaves workplace control. Clearing the browser's site data also removes its local cached data.
- If the shared password is lost or exposed, the Firebase-project owner resets it in Firebase Authentication and redistributes it through the approved secret-sharing channel. Developers do not need the password.
- If the shared account itself changes, update the UID in `firestore.rules`, deploy the rules, and repeat unauthenticated and authenticated access checks.
- If a deployment fails, retain the last successful Pages deployment, inspect the failed Actions run, correct configuration or code, and rerun it.

This release intentionally has no export, individual accounts, roles, audit history, fleet-wide totals, or automated tests.
