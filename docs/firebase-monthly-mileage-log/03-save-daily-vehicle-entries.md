# 03 — Save daily vehicle entries

**What to build:** Let an authenticated operator explicitly save a reviewed calculation as the single daily vehicle entry for that vehicle and driving date. Saving retains all source quantities, recorded fuel values, vehicle details, and timestamps while making success, failure, and synchronization state clear.

**Blocked by:** 01 — Prepare dated daily calculations; 02 — Create and connect shared Firebase access.

**Execution mode:** AFK once Ticket 02's Firebase project and web configuration are available.

**Status:** done

**Completed:** 2026-10-26

- [x] Calculate and Save Entry remain separate operator actions.
- [x] Save Entry is available only when the displayed calculation represents the current valid inputs.
- [x] Each Firestore document has a deterministic identity derived from stable vehicle identity and driving date.
- [x] At most one daily vehicle entry can exist for a vehicle and driving date, including when different devices save it.
- [x] A first save records the driving date, month key, vehicle identity, vehicle-name snapshot, consumption-rate snapshot, all entered quantities, every recorded fuel component, the final fuel total, and creation/update timestamps.
- [x] Attempting to save an existing vehicle/date shows a Bulgarian warning before replacement.
- [x] Confirming replacement updates the existing entry rather than creating a duplicate and preserves its original creation time.
- [x] A successful save is visibly confirmed in Bulgarian.
- [x] A failed save preserves the operator's current work, explains the failure in Bulgarian, and offers a retry path.
- [x] An offline save is visibly marked as waiting to synchronize.
- [x] A queued save synchronizes when connectivity returns and its pending indication clears.
- [x] The most recently saved change wins when the same entry is changed concurrently.

