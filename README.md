# Mileage Log Book Calculator

The workplace log calculates and stores daily vehicle fuel records and presents per-vehicle monthly totals. The physical notebook remains the official record.

Production: <https://georgievmv.github.io/mileage-log-book-calculator/>

See [the production runbook](docs/production-runbook.md) for GitHub Pages deployment, Firebase configuration and security-rule deployment, shared-account recovery, trusted-device guidance, and the manual release checklist.

## Firebase workplace setup

The workplace owner creates and recovers the shared account; its password must only be distributed through the workplace's approved secret-sharing channel and must never be added to this repository.

1. Create a dedicated Firebase project on the Spark plan under the workplace Google account.
2. Create Cloud Firestore in `europe-central2` (Warsaw).
3. Enable Email/Password in Firebase Authentication and create exactly the shared operator account.
4. Register a web app, copy `.env.example` to `.env.local`, and fill in the web configuration. These identifiers are not passwords, but environment-specific values stay out of source control.
5. Copy the shared account's non-secret UID from Authentication into `firestore.rules`, replacing `REPLACE_WITH_SHARED_OPERATOR_UID`. The placeholder fails closed until this is done.
6. Set `$env:FIREBASE_PROJECT_ID` to the dedicated project ID, then deploy to that explicit target with `firebase deploy --only firestore:rules --project $env:FIREBASE_PROJECT_ID`. Do not rely on a Firebase CLI default project.
7. If access is lost, the workplace Firebase-project owner resets the shared account password in Firebase Authentication and redistributes it through the approved secret-sharing channel. Developers do not need and should not receive the password.

The app deliberately stops with a Bulgarian configuration error when a required Firebase value is absent. Authentication is persisted locally and Firestore uses persistent multi-tab offline caching, so only trusted workplace devices should be used.

## Production deployment

Pushes to `main` deploy through the repository's GitHub Pages workflow. Its Firebase values come from GitHub Actions secrets named like the variables in `.env.example`; no production environment file is committed. GitHub Pages must use **GitHub Actions** as its publishing source, and `georgievmv.github.io` must be an authorized Firebase Authentication domain.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
