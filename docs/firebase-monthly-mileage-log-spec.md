## Problem Statement

Operators currently use the application to calculate a vehicle's daily fuel consumption and then copy the result into a physical notebook. The application does not retain those calculations, so at the end of each month the daily records must be collected and totaled manually. The workplace needs a shared log that is available from multiple devices, keeps one reliable entry for each vehicle and driving date, and presents all monthly totals needed for the physical notebook.

## Solution

Extend the application with a driving date, authenticated Cloud Firestore persistence, and a monthly vehicle summary. Operators will continue to choose a vehicle and use the existing calculator, then explicitly save the reviewed result as a daily vehicle entry. A separate monthly-log page will show chronological entries and totals for every entered quantity and calculated fuel component for one selected vehicle and month.

All operators will use one shared email/password identity and have equal access. The app will remain hosted on GitHub Pages, use a dedicated Firebase project on the free Spark plan, and store Firestore data in the Warsaw region. The interface additions will be written in Bulgarian and will support trusted workplace devices when temporarily offline.

## User Stories

1. As an operator, I want to sign in with the shared workplace credentials, so that the workplace log is protected from public access.
2. As an operator, I want my sign-in to persist between visits, so that I do not repeatedly enter the shared credentials on a trusted device.
3. As an operator, I want to log out, so that I can remove access from a device when necessary.
4. As an operator, I want authentication failures explained in Bulgarian, so that I can correct the problem.
5. As an operator, I want to move between the calculator and monthly log, so that daily entry and monthly reporting are clearly separated.
6. As an operator, I want to select a vehicle from the existing application list, so that the correct standard consumption rate is used.
7. As an operator, I want the vehicle list and consumption rates to remain managed by the application, so that saving records does not complicate vehicle configuration.
8. As an operator, I want the driving date to default to today, so that normal daily entry is quick.
9. As an operator, I want to select a past driving date, so that I can record a forgotten day later.
10. As an operator, I want future driving dates rejected, so that the workplace log cannot contain impossible records.
11. As an operator, I want to enter the same mileage and condition values used by the existing calculator, so that the established workflow remains familiar.
12. As an operator, I want negative quantities rejected, so that invalid values do not enter monthly totals.
13. As an operator, I want a condition distance greater than the total distance rejected, so that impossible daily vehicle entries are not stored.
14. As an operator, I want condition distances to be allowed to overlap, so that kilometres driven under multiple simultaneous conditions are represented correctly.
15. As an operator, I want calculation to remain separate from saving, so that I can review a result before changing the workplace log.
16. As an operator, I want every fuel component rounded normally to three decimal places, so that displayed and recorded values match the physical notebook.
17. As an operator, I want the daily total calculated from the recorded three-decimal component values, so that the visible components reconcile exactly with the total.
18. As an operator, I want to save the original entered quantities and every calculated fuel component, so that monthly totals remain traceable.
19. As an operator, I want a saved entry to retain the vehicle name and consumption rate used for its calculation, so that later vehicle-configuration changes do not alter historical records.
20. As an operator, I want at most one daily vehicle entry for a vehicle and driving date, so that the monthly vehicle summary cannot contain accidental duplicates.
21. As an operator, I want a warning when the selected vehicle and date already have an entry, so that I understand that saving will update existing data.
22. As an operator, I want a clear success state after saving, so that I know the entry is part of the workplace log.
23. As an operator, I want a clear error state and retry opportunity after a failed save, so that a temporary problem does not silently lose work.
24. As an operator, I want to save while temporarily offline, so that an unreliable connection does not stop daily work.
25. As an operator, I want to see when a change is waiting to synchronize, so that I do not mistake local data for confirmed remote data.
26. As an operator, I want queued changes synchronized when connectivity returns, so that all trusted devices eventually see the same workplace log.
27. As an operator, I want to choose a calendar month on the monthly-log page, so that I can prepare the corresponding physical notebook report.
28. As an operator, I want the current month selected by default, so that the common workflow needs fewer actions.
29. As an operator, I want to choose one vehicle for the monthly vehicle summary, so that vehicles are never mixed into a fleet-wide result.
30. As an operator, I want daily vehicle entries ordered from oldest to newest, so that the screen follows the order of the physical notebook.
31. As an operator, I want dates with no entry omitted, so that the monthly view contains only actual driving records.
32. As an operator, I want totals for every entered quantity, so that I can transfer all source totals to the physical notebook.
33. As an operator, I want totals for every calculated fuel component, so that I can transfer the complete monthly calculation to the physical notebook.
34. As an operator, I want monthly totals derived from recorded three-decimal values, so that monthly arithmetic matches the visible daily records.
35. As an operator, I want to open an existing daily vehicle entry in a prefilled calculator, so that corrections use the familiar calculation workflow.
36. As an operator, I want to recalculate and explicitly save an edited entry, so that corrections are reviewed before replacing stored values.
37. As an operator, I want to see when an entry was last updated, so that a recent overwrite is visible even though operators are not individually identified.
38. As an operator, I want the most recently saved change to win when two people edit the same entry, so that the first version does not require record locking.
39. As an operator, I want to delete an incorrect entry, so that mistakes do not remain in monthly totals.
40. As an operator, I want deletion to require confirmation, so that a daily vehicle entry is not removed accidentally.
41. As an operator, I want old monthly records retained indefinitely, so that previous workplace-log data remains available for reference.
42. As an operator, I want all new controls, statuses, confirmations, and errors in Bulgarian, so that the extended workflow remains consistent with the calculator.

## Implementation Decisions

- Use a dedicated Firebase project on the Spark plan.
- Use Cloud Firestore in the immutable regional location `europe-central2` (Warsaw), as recorded by the applicable architecture decision.
- Continue deploying the React application through GitHub Pages; Firebase Hosting is not required.
- Register the GitHub Pages origin as an authorized Firebase Authentication domain.
- Use Firebase email/password authentication with one shared workplace identity. Do not model individual operators, roles, ownership, or per-entry creator attribution.
- Persist the authenticated session and provide an explicit logout action. Password recovery depends on access to the shared account's email address.
- Protect all Firestore reads and writes with authentication-based security rules. An unauthenticated client receives no access.
- Enable persistent Firestore offline caching for trusted workplace devices. Surface pending synchronization and operation failures in the UI.
- Introduce top-level Calculator and Monthly Log views without adding a routing dependency unless browser-addressable routes become necessary.
- Keep the existing vehicle catalogue and standard consumption rates in application configuration rather than Firestore.
- Give each configured vehicle a stable identifier that does not depend on its display name.
- Store each daily vehicle entry as one Firestore document whose identity is deterministically derived from the stable vehicle identifier and driving date. This enforces the one-entry-per-vehicle-per-date rule across devices.
- A daily vehicle entry stores the driving date, a month key, vehicle identifier, vehicle-name snapshot, consumption-rate snapshot, all original entered quantities, every rounded fuel component, the rounded final fuel total, and server-maintained creation and update timestamps.
- Store the driving date and month as timezone-independent calendar values. Display dates in the Bulgarian user-facing format.
- Preserve the current fuel-consumption formulas. Replace display-only truncation with normal three-decimal rounding and persist those rounded component values.
- Calculate daily totals by summing recorded fuel components. Calculate monthly totals by summing the values stored in the selected vehicle's daily entries.
- Validate required values, prevent future dates and negative quantities, and prevent an individual condition distance from exceeding total distance. Condition fields may overlap and are not required to sum to total distance.
- Keep Calculate and Save Entry as distinct actions. Saving is available only after a valid calculation represents the current inputs.
- Before replacing an existing vehicle/date document, display an update warning. Use last-write-wins behavior for concurrent changes and display the last-updated time.
- Query monthly records by stable vehicle identifier and month key, then order them by driving date ascending.
- The monthly page is read-only except for Edit and Delete actions. Editing returns to a prefilled calculator; deletion requires confirmation.
- Retain records indefinitely. Provide no bulk month deletion or automatic retention policy.
- Use Bulgarian for all newly introduced interface text.
- Keep Firebase configuration outside committed source through the build environment. Firebase's public web identifiers are not authorization secrets, but environment separation prevents accidental project mixing.
- Provide actionable loading, empty, offline, success, authentication-error, read-error, and write-error states.

## Testing Decisions

- No automated test suite will be added for this feature, at the user's explicit request.
- Verification will be manual and based on externally visible behavior rather than component internals.
- Manual verification will cover shared-account sign-in and logout; current, past, and invalid future dates; calculation without saving; first save; duplicate update warning; monthly vehicle filtering; chronological ordering; every field total; three-decimal reconciliation; prefilled editing; confirmed deletion; unauthenticated access denial; offline pending state; reconnection synchronization; and Bulgarian status and error text.
- Firestore security rules will be manually verified against authenticated and unauthenticated access before deployment.
- The repository contains no existing tests that provide prior art for this feature.

## Out of Scope

- Separate accounts for individual operators.
- Administrator, editor, or read-only roles.
- Identifying who created or changed an entry.
- Audit history or restoration of earlier entry versions.
- Record locking or interactive conflict resolution.
- Fleet-wide totals that combine different vehicles.
- CSV, spreadsheet, JSON, or printable export.
- Importing existing physical-notebook records in bulk.
- Managing vehicles or consumption rates through Firebase or the UI.
- Firebase Hosting, Cloud Functions, paid automated backups, or other paid-plan features.
- Deleting an entire month at once or automatically deleting old records.
- Replacing the physical notebook as the official workplace record.
- Automated unit, integration, end-to-end, or security-rule tests.

## Further Notes

- The physical notebook remains the final official record; the monthly vehicle summary exists to make its manual completion faster and less error-prone.
- The shared account deliberately trades individual accountability for simpler operation. Moving to individual accounts later will require a new authorization model and migration decisions but does not require changing the meaning of historical daily vehicle entries.
- Offline persistence leaves cached workplace data on the device. Operators should use it only on trusted workplace devices and log out when a device should no longer have access.
- The Firebase project, Authentication provider, shared account, Firestore database, security rules, and authorized GitHub Pages domain must be configured before the deployed application can save production data.
