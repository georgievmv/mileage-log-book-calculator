# Mileage Log Book

This context describes the shared workplace record used to calculate and collect vehicle fuel consumption.

## Language

**Workplace log**:
The single shared collection of mileage entries used by all coworkers for monthly reporting.
_Avoid_: Personal log, user log

**Operator**:
Any coworker using the application. Operators have equal access and are not individually identified by the application.
_Avoid_: Account owner, administrator

**Daily vehicle entry**:
The single record of one vehicle's combined mileage and fuel consumption for one driving date. A vehicle can have at most one entry for a given date.
_Avoid_: Trip, calculation, submission

**Driving date**:
The calendar date on which the vehicle was driven, regardless of when its entry was recorded. It may be today or a past date, but never a future date.
_Avoid_: Creation date, submission date

**Monthly vehicle summary**:
The totals of every entered quantity and every calculated fuel component from one vehicle's daily entries within a calendar month. Vehicles are summarized separately and are not combined into a fleet-wide total.
_Avoid_: Fleet total, combined report

**Recorded fuel value**:
A fuel quantity rounded normally to three decimal places before it becomes part of a daily vehicle entry. Daily and monthly totals are sums of these recorded values.
_Avoid_: Display-only value, truncated value

## Delivery status

Updated 2026-10-26.

- **Ticket 01 — Prepare dated daily calculations:** Done. The calculator produces a validated, save-ready daily vehicle entry with a stable vehicle identity, driving date, input constraints, and reconciled three-decimal fuel values. Results become ineligible for saving when an input changes until they are recalculated.
- **Ticket 02 — Create and connect shared Firebase access:** Done. The application uses the dedicated Firebase project and its `europe-central2` Firestore database, requires the persistent shared email/password identity, provides Bulgarian authentication feedback and logout, exposes protected Calculator and Monthly Log navigation, enables persistent offline caching, and has published Firestore rules restricted to the shared operator UID. Setup and account recovery are documented without credentials.
- **Ticket 03 — Save daily vehicle entries:** Done. Operators can explicitly save only a current reviewed calculation. Each vehicle and driving date maps to one deterministic Firestore document containing the complete input, vehicle, fuel, and timestamp snapshot. Bulgarian feedback covers replacement confirmation, success, failure with retry, and pending offline synchronization; transactional online writes preserve the original creation time.
- **Ticket 04 — Show monthly vehicle summaries:** Done. Authenticated operators can select a configured vehicle and month, read chronological daily entries, see every stored quantity and fuel component, and use per-field monthly totals. Bulgarian loading, empty, cached/stale, pending-write, failure, and retry states are included.
- **Ticket 05 — Correct or delete entries:** Done. Monthly rows provide explicit Edit and Delete actions. Editing prefills the calculator, requires recalculation and saving, preserves creation time, updates deterministic identities atomically when the vehicle/date changes, and retains replacement warnings. Deletion is identified and confirmed in Bulgarian; live snapshots refresh rows and totals immediately.
- **Next ticket:** Ticket 06 — Deploy and verify workplace log.
