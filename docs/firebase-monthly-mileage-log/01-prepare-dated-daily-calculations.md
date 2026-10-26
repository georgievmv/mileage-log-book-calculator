# 01 — Prepare dated daily calculations

**What to build:** Make the existing calculator produce a complete, save-ready daily vehicle entry without persisting it. An operator chooses a vehicle and driving date, enters the existing mileage values, and receives validated three-decimal fuel components whose visible sum matches the visible daily total.

**Blocked by:** None — can start immediately.

**Execution mode:** AFK — no human interaction required.

**Status:** done

**Completed:** 2026-10-26

- [x] Every configured vehicle has a stable identifier independent of its Bulgarian display name.
- [x] The calculator includes a driving date that defaults to today.
- [x] Today and past driving dates are accepted, while future dates are rejected with a Bulgarian message.
- [x] Existing mileage and fuel-consumption formulas remain unchanged except for the agreed rounding behavior.
- [x] Negative input values are rejected.
- [x] An individual condition distance cannot exceed the total distance, while different condition distances may overlap.
- [x] Every fuel component is rounded normally to three decimal places before becoming a recorded fuel value.
- [x] The daily fuel total is the sum of the displayed three-decimal fuel components and reconciles exactly with them.
- [x] Changing an input after calculating makes the previous result ineligible for saving until it is recalculated.
- [x] The existing vehicle-selection and calculation workflow remains usable in Bulgarian.

