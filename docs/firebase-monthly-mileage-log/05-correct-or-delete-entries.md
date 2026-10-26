# 05 — Correct or delete entries

**What to build:** Let an authenticated operator correct or remove an existing daily vehicle entry from the monthly log. Editing returns to the familiar calculator with original source values prefilled; deletion is explicit and confirmed before it changes the workplace log.

**Blocked by:** 04 — Show monthly vehicle summaries.

**Execution mode:** AFK — no human interaction required after its blocker is complete.

**Status:** done

- [x] Each monthly row exposes Edit and Delete actions without making table cells directly editable.
- [x] Edit opens the calculator with the correct vehicle, driving date, and all original entered quantities prefilled.
- [x] An edited entry must be recalculated and explicitly saved before Firestore changes.
- [x] Saving an edit updates the existing deterministic vehicle/date entry rather than creating a duplicate.
- [x] If an edit changes the vehicle or driving date to a pair that already exists, the operator receives the same replacement warning used during first entry.
- [x] The entry's original creation time is retained and its update time changes after correction.
- [x] The monthly log displays the entry's last-updated time in a Bulgarian-friendly format.
- [x] Last-save-wins behavior remains clear without adding locks, individual attribution, or audit history.
- [x] Delete always requires Bulgarian confirmation identifying the vehicle and driving date.
- [x] Cancelling deletion leaves the entry and summary unchanged.
- [x] Confirmed deletion removes the entry and immediately refreshes every affected monthly total.
- [x] Failed edits and deletions preserve a usable screen and provide Bulgarian retry feedback.

