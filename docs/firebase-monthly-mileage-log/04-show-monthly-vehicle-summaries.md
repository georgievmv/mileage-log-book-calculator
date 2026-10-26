# 04 — Show monthly vehicle summaries

**What to build:** Give an authenticated operator a monthly-log page where one vehicle and calendar month can be selected. The page shows that vehicle's daily entries in notebook order and provides a monthly vehicle summary containing totals for every entered quantity and every recorded fuel component.

**Blocked by:** 03 — Save daily vehicle entries.

**Execution mode:** AFK — no human interaction required after its blocker is complete.

**Status:** done

- [x] The monthly-log page defaults to the current calendar month.
- [x] An operator can select any configured vehicle and calendar month.
- [x] The page reads only entries matching the selected stable vehicle identity and month.
- [x] Daily vehicle entries are displayed oldest to newest by driving date.
- [x] Dates without an entry do not produce empty rows.
- [x] Every stored source quantity is visible for each daily entry.
- [x] Every recorded fuel component and final fuel total is visible for each daily entry.
- [x] The monthly vehicle summary totals every entered quantity separately.
- [x] The monthly vehicle summary totals every recorded fuel component separately from stored three-decimal values.
- [x] Vehicles are never combined into a fleet-wide total.
- [x] Loading, no-entry, offline/cache, stale-data, and read-failure states are understandable in Bulgarian.
- [x] Retrying after a read failure does not require reloading the entire application.
- [x] Old months remain available indefinitely and there is no bulk month-deletion control.

