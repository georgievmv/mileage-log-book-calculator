# 02 — Create and connect shared Firebase access

**What to build:** Connect the application to a dedicated Firebase project and protect the workplace log behind one persistent shared email/password identity. An authenticated operator can enter the Bulgarian application shell, remain signed in on a trusted device, and log out; an unauthenticated visitor cannot read or write Firestore data.

**Blocked by:** None — can start immediately.

**Execution mode:** Human interaction required — the human creates resources under the correct Google account and handles private credentials; the agent implements and configures the application integration.

**Status:** done

**Completed:** 2026-10-26

- [x] A human creates a dedicated Firebase project on the Spark plan under the intended Google account.
- [x] A human creates the Cloud Firestore database in `europe-central2` (Warsaw).
- [x] A human enables Firebase email/password authentication and creates the shared workplace account.
- [x] The shared password is never committed to the repository or disclosed to the implementation agent.
- [x] A human registers a Firebase web app and makes its non-secret web configuration available through the agreed build environment.
- [x] The application fails clearly when required Firebase configuration is missing rather than connecting to an unintended project.
- [x] An operator can sign in with the shared account and receives Bulgarian feedback when authentication fails.
- [x] Authentication persists between visits on a trusted device.
- [x] An authenticated operator can log out.
- [x] The protected application shell exposes Calculator and Monthly Log navigation.
- [x] Persistent Firestore offline caching is enabled for trusted workplace devices.
- [x] Firestore security rules deny all unauthenticated reads and writes and allow the shared authenticated identity to read and write the workplace log.
- [x] Firebase project setup and shared-account recovery responsibilities are documented without recording credentials.

