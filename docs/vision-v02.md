# Epilepsy Care — vision prototype v0.2

Built against the user's 17 November 2026 discovery PRD. Static responsive HTML/CSS/JavaScript. Fictional data only; session-memory state resets on reload. No analytics, clinical integrations, live notifications, persistence, device access or medical functionality.

## Coverage
Patient, caregiver, clinician role previews; recording candidates, unanswered and unfinished states; optional recovery; diary, calendar and provenance; medication diary; sample action plan; fixed illustrative charts and report preview; simulated sharing, export and deletion; wearable and duplicate-review concepts; child/teen language preview; resilience scenarios; system appearance; in-app decision guide.

## Design clarifications
- Record elapsed time is distinct from seizure timing.
- Activation timestamps are retained; onset and end default to unknown.
- Check-in is manually triggered, not a clinically selected timing policy.
- Role scopes are illustrative, not settled authorization policy.
- PDF export and invitations are simulated outcomes, not actual files or messages.
- Charts are fixed examples, not computed from live session records.
- Research recruitment and consent are separate from onboarding.

## Verification
- JavaScript syntax check passed.
- Browser: desktop dashboard renders.
- Browser: 390px-wide phone layout inspected, bottom navigation present.
- Browser: start, check-in, unanswered, stop and save journey passed.
- Browser: unfinished recording shows unknown status and unknown seizure endpoints.
- Accessibility implementation includes semantic controls, labels, focus indicators, text status, no animation and system themes.

## Remaining validation
Not tested on a physical Android device. Full route-by-route manual QA, dark-mode visual QA, screen readers, keyboard audit, 200% text scaling, formal WCAG contrast and reflow review, patient/caregiver usability research remain outstanding. No claim of full accessibility or clinical validation.

All SAFE-01 through SAFE-12 research gates remain open in the in-app guide. This is a first reviewable prototype, not production health software or a declaration that all PRD acceptance criteria have passed.

## v0.2 refinement
- Added living design-system route: theme specimens, tokens, component states, native dialog, and navigation alternatives.
- Added mapping for all 40 conceptual PRD screen destinations.
- Added W3C accessibility evidence and computed contrast log (eight declared pairs, all >=4.5:1).
- Added caregiver patient-context selection and tighter view restrictions. These are fictional UX scopes, not production authorization.
- Added persistent recorder context reminder and retained originating role when switching demo perspectives.
- Added consistent action-plan shortcut, larger primary actions and improved small-screen typography.
- Fixed skip-link navigation so it focuses content without changing the route.

### v0.2 verification
JavaScript syntax checks passed. Browser inspection covered 320px light and 390px dark iframe viewports, caregiver selection and medication denial, component dialog opening/closing and Profile navigation candidate. Observed 305px content viewport and 305px scroll width in the narrow design layout (iframe scrollbar consumes remaining width). Eight colour pairs were measured at 5.37:1 or above. Neither these samples nor responsive screenshots establish full WCAG compliance. Full real-device, 200% text scaling, screen-reader, motor-access and participant testing remain outstanding.

### Evidence sources reviewed 17 November 2026
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/

Design interpretation: target ordinary text contrast >=4.5:1; use generous proposed control heights rather than treating minimum targets as an optimal design; inspect narrow reflow; keep language clear and optional tasks postponable. These sources do not resolve clinical seizure interaction policy.

## Run locally

Run `python -m http.server 8080 --directory prototypes/vision-v02` from the repository root and open http://localhost:8080. No installation or build step required.
