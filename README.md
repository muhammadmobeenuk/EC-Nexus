# Epilepsy Care Nexus — v0.2 prototype foundation

A frontend-only, fictional-data prototype. The green Modern Wellness / blue Premium Midnight v0.2 experience is now the default app. This is a development foundation, not production health software.

## Setup and commands

Use Node.js 22.12 or later (validated here with Node 24.22.1) and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173). `npm start` is an alias for development. For a local production preview:

```sh
npm test
npm run build
node scripts/verify-foundation.mjs
npm run preview
```

`dist/` is generated, ignored build output. The verification script checks CSS equivalence against the preserved v0.2 reference, original archive source hashes, and absence of archives/browser-storage access in the default build. It requires a completed build first. There are no runtime package dependencies; Vite, jsdom, and Prettier are development dependencies.

## Structure

- `src/main.js`, `src/app.js`, `src/router.js`: bootstrap, page lifecycle, and hash navigation.
- `src/domain/`: fresh synthetic sessions, fixtures, stable record/date lookup, recorder transitions, and existing demo permission rules.
- `src/screens/`: care journeys, supporting concept screens, design reference, and explicit route registry. No global function overrides.
- `src/actions.js`, `src/ui/`: one domain-action dispatcher and shared view helpers.
- `src/styles/`: formatted original baseline and v0.2 refinements, loaded in their original cascade order.
- `tests/`: recorder, role/context, calendar, and DOM interaction regressions.
- `scripts/verify-foundation.mjs`: archive/build/CSS integrity checks.
- `prototypes/vision-v02/`: unchanged pre-refactor v0.2 reference, retained for comparison.
- `prototypes/purple-local/`: archived purple localStorage app, excluded from the default production build.
- `docs/FOUNDATION_AUDIT.md`, `docs/PROTOTYPE_BOUNDARIES.md`: findings, changes, validation, limitations, and unresolved decisions.

## Data and safety boundaries

All v0.2 identities, schedules, charts, and records are synthetic. State lives in page memory and resets on reload; no localStorage, sessionStorage, cookies, persistence, telemetry, clinical accounts, device discovery, synchronization, or external service calls are used by the app. The existing W3C evidence links are ordinary outbound navigation links.

Recorder elapsed time measures recorder activity, not seizure duration. Activation does not establish onset; stopping does not establish seizure completion. Unanswered check-ins remain clinically unknown. Corrections retain provenance. Role switching cannot change an active recording's original attribution. Recovery is optional.

Export, sharing, invitations, deletion, reminders, assistance, and wearable actions only simulate outcomes. No PDF, live link, notification, device connection, medical interpretation, or emergency response is produced. Demo permissions are not real authorization. Do not enter personal information. See the boundaries document before extending behavior.

The purple archive retains its original `ec-nexus-v1` storage behavior. Its source was preserved without running it or accessing browser data. The default app never reads, imports, migrates, clears, or overwrites that data. Browser data remains tied to its original origin; serving the archive at a different origin will not reveal or transfer it. To inspect archive source, read the files; running it is outside the default workflow.

## Validation on 17 November 2026

- Baseline `npm test`: zero tests; original v0.2 JavaScript syntax checks passed.
- Refactored `npm test`: passed; `node tests/foundation.test.js` reports 21 passing tests, zero failures/skips.
- Production build: passed. `node scripts/verify-foundation.mjs`: passed.
- `git diff --check`: passed.
- Managed browser preview: **blocked**. `sites-preview start /workspace/EC-P` failed with `listen EPERM ... 127.0.0.1:4173`; status reported stopped. No refactored browser journey or screenshot evidence is claimed.

DOM tests cover navigation/activation, record-save flows, caregiver context and restrictions, stable calendar links, correction provenance, and skip-link focus/labels. They do not establish visual layout, CSS rendering, or browser accessibility behavior. The original CSS cascade matches after formatting normalization; visual parity is still untested.

Outstanding: real-browser light/dark review, 320/390px layout and document overflow, native dialog and keyboard behavior, physical Android/iOS devices, 200% text scaling, screen readers, switch input, formal accessibility review, and lived-experience research. No full accessibility compliance or clinical validation is claimed.
