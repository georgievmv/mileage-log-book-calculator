# 06 — Deploy and verify the workplace log

**What to build:** Put the completed workplace log into production on its existing GitHub Pages site, connect it to the dedicated Firebase project, verify its security and agreed workflows on a real trusted workplace device, and leave concise operating instructions for future maintainers.

**Blocked by:** 02 — Create and connect shared Firebase access; 03 — Save daily vehicle entries; 04 — Show monthly vehicle summaries; 05 — Correct or delete entries.

**Execution mode:** Human interaction required — the human authorizes Firebase/GitHub access when needed, confirms the production shared identity, and performs the final real-device check; the agent prepares configuration, deployment, verification steps, and documentation.

**Status:** waiting-for-human

**Agent preparation completed:** 2026-10-26. The Pages workflow and production runbook are ready; the remaining unchecked items require the workplace owner, production services, or a trusted workplace device.

- [ ] A human confirms that the intended Firebase project, shared account email, and GitHub Pages repository are being used without disclosing the password.
- [ ] The GitHub Pages origin is listed as an authorized Firebase Authentication domain.
- [ ] Production build configuration targets the dedicated Firebase project without committing credentials or environment-specific files that should remain local. The workflow accepts uncommitted build-time configuration; a human must confirm that its GitHub Actions secret values identify the dedicated project.
- [ ] The production build completes and is deployed through the existing GitHub Pages workflow.
- [ ] An unauthenticated production visitor cannot enter the application or read/write Firestore data.
- [ ] A human confirms shared-account sign-in, persistent sign-in, and logout on a trusted workplace device.
- [ ] The complete calculate, review, save, update-warning, monthly-summary, edit, and confirmed-delete workflow is manually verified in production.
- [ ] Current and past dates work, future dates and invalid quantities are rejected, and condition distances may overlap.
- [ ] Daily and monthly displayed totals reconcile exactly from three-decimal recorded fuel values.
- [ ] Offline saving shows a pending state and synchronizes after the real device reconnects.
- [ ] Bulgarian labels, loading states, confirmations, success messages, and recoverable error messages are reviewed in the deployed interface.
- [x] Setup, deployment, Firebase configuration, security-rule deployment, shared-account recovery, trusted-device use, and routine operation are documented without including secrets.
- [x] The documentation states that the physical notebook remains the official record and that export, individual accounts, roles, audit history, fleet totals, and automated tests are outside this release.
