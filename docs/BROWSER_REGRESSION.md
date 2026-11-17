# Browser regression validation — BLOCKED

Investigation date: 17 November 2026, approximately 18:52 UTC / Europe/London.

## Revision and environment

- Branch verified: `feat/prototype-foundation`.
- Application commit verified: `dcf8703705c692fccd729ebda9c5d2b8d906bf5c`.
- Working tree was clean before this documentation update.
- Draft PR #1 was confirmed open, draft, and unmerged; its head matched this application commit and its base was `main` at `21af43044af25a5659f96b641bd3cbeb92fe054f`.
- Selected managed environment: `ccarenv_b64_Y2NhcmVudl8zZWMzMjZjZTEwNTg4MTkxOGY3ZTQzNjYwNmZjZGE4MQ`.
- Actual browser: **not launched**. No browser version or measured viewport is available because the supported preview never returned a URL. Viewports below are targets, not observations.
- No app code, archive, hosting manifest, security controls, or environment configuration changed during this investigation.

## Preview evidence E1 — FAIL

Executed from `/workspace/EC-P` using the supported managed preview launcher:

```sh
sites-preview status
sites-preview start /workspace/EC-P
```

The first command returned `Sites preview stopped`. The startup command exited with code 1 and returned:

```text
sites-preview: preview exited during startup:

> epilepsy-care-nexus@0.2.0 dev
> vite --host 0.0.0.0 --host 127.0.0.1 --port 4173 --strictPort

error when starting dev server:
Error: listen EPERM: operation not permitted 127.0.0.1:4173
    at Server.setupListenHandle [as _listen2] (node:net:2368:21)
    at listenInCluster (node:net:2499:12)
    at node:net:2728:7
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
```

Follow-up `sites-preview status` again returned `Sites preview stopped`. `sites-preview --help` exposed only `start SITE_ROOT`, `status`, and `stop`; no repair command was advertised.

## Environment evidence E2

The environment status API reported the same selected environment as connected/running with current observations, unrestricted outbound networking, no reported environment failure, and an SSH portal on port 22. It advertised a shared browser/desktop capability with state unknown. It did not return an HTTP portal or network diagnostic failure.

These observations do **not** establish preview readiness or explain the bind denial. An absent HTTP portal is not proven to be the cause. The observed failure is a local `listen` operation returning EPERM, not a Vite compilation error or a confirmed application regression. The precise underlying policy/runtime fault remains undiagnosed.

The managed-preview instructions require the daemon-owned preview, forbid alternate servers or sandbox/network bypasses, and advise stopping when infrastructure is unavailable. No new deployment, server workaround, security change, browser installation, or permission escalation was used. No supported environment-change tool for repairing local bind permissions was available.

## Browser matrix

Every row is **BLOCKED** by E1: no supported preview URL, so none of the steps below was executed in a browser. Browser for every row: **not launched**. There are no screenshots, layout measurements, computed-style observations, or browser PASS results. The table preserves a reproducible queue for the next working preview.

Target CSS viewports: phone 320×800 and 390×844, tablet 768×1024, desktop 1440×900. These are test targets, not physical-device coverage.

| Check                               | Target viewport(s)     | Status  | Steps to execute when preview is restored                                                                                                                                                                                                                       | Evidence |
| ----------------------------------- | ---------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Patient navigation                  | All four               | BLOCKED | Open each existing destination through desktop/mobile navigation; verify expected screen and active destination; verify unknown hashes offer a return route.                                                                                                    | E1       |
| Caregiver navigation                | All four               | BLOCKED | Switch to Caregiver; require fictional patient selection; select Alex; browse available shared care; change patient context and confirm boundaries.                                                                                                             | E1       |
| Clinician navigation                | All four               | BLOCKED | Switch to Clinician; inspect synthetic history/reports and original permission-denied destinations; do not infer real authorization.                                                                                                                            | E1       |
| Record without activation           | All four               | BLOCKED | Open Record from navigation and direct hash; verify the ready screen appears without active recorder or new entry.                                                                                                                                              | E1       |
| Both activation candidates          | 390×844, 1440×900      | BLOCKED | Start through single-tap/keyboard; repeat from fresh session with tap-confirm; cancel confirmation first, then confirm; verify only activation creates a recorder.                                                                                              | E1       |
| Active recorder context             | 390×844, 1440×900      | BLOCKED | Start; note activation and source; navigate away/back; switch Patient/Caregiver/Clinician and reselect fictional patient; verify reminder, original attribution, and context denial without reassignment.                                                       | E1       |
| Unanswered check-in and stopping    | 390×844, 1440×900      | BLOCKED | Manually show check-in; leave unanswered; stop; verify unknown seizure information and that recorder elapsed time is not seizure duration.                                                                                                                      | E1       |
| Unfinished save and recovery        | 390×844, 1440×900      | BLOCKED | Start; leave unfinished; save; verify unknown endpoints/provenance; open optional recovery, skip, and return later.                                                                                                                                             | E1       |
| Duplicate stop/save protection      | 390×844, 1440×900      | BLOCKED | Attempt rapid repeated stop/save interactions; verify stop timestamp is not replaced, one entry is created, and absent-session actions do not corrupt state.                                                                                                    | E1       |
| Calendar/detail identity            | 390×844, 1440×900      | BLOCKED | Add live, retrospective, and simulated device records; open seeded 6/12/16 November entries from calendar; verify each detail/provenance still identifies its original record.                                                                                  | E1       |
| Caregiver restrictions              | 390×844, 1440×900      | BLOCKED | Try patient-specific routes before selection; select Alex; attempt medication/account controls; revoke via Patient and return to Caregiver; verify existing restrictions, not new access policies.                                                              | E1       |
| Clinician mutation denial           | 390×844, 1440×900      | BLOCKED | Open diary detail/recorder/medication concepts as Clinician; verify denied/disabled mutations; retain existing visibly simulated PDF/sharing exceptions.                                                                                                        | E1       |
| Native dialog lifecycle             | 390×844, 1440×900      | BLOCKED | Open design-system sample dialog with keyboard and pointer; close with its button; reopen and press Escape; verify modal state, focus containment, and restoration to the opener.                                                                               | E1       |
| Keyboard and labels                 | All four               | BLOCKED | Tab/Shift+Tab through navigation, role selector, activation method, action controls, and dialog; activate skip link; inspect visible focus and accessible names/labels, without claiming a complete accessibility audit.                                        | E1       |
| System light/dark appearance        | All four, both schemes | BLOCKED | Use supported browser/system colour-scheme controls; inspect dashboard, recorder, diary/detail, design gallery, and dialog in both schemes; verify no persistent manual override.                                                                               | E1       |
| Reflow and fixed navigation         | All four, both schemes | BLOCKED | Inspect every route at each target; compare document scroll width with viewport width; distinguish intentional table scrolling; scroll to final controls/footer and confirm fixed bottom navigation does not cover content or focus.                            | E1       |
| Reload and legacy storage isolation | 390×844, 1440×900      | BLOCKED | Create synthetic changes; reload; verify seed entries, pending doses, Patient role, and no recorder. In an isolated synthetic browser test context, instrument storage APIs before app startup to detect access; never inspect or mutate actual legacy storage. | E1       |

## Automated evidence — separate from browser validation

Rerun after this documentation update:

- `npm test`: PASS (the environment's runner reports one passing test-file container).
- `node tests/foundation.test.js`: PASS, 21 tests, 0 failures, 0 skips.
- `npm run build`: PASS.
- `node scripts/verify-foundation.mjs`: PASS; normalized CSS parity, preserved source hashes, and storage/archive exclusion from build.
- `git diff --check` and staged whitespace check: PASS.

These are Node/jsdom/build/source checks. They do not establish actual browser interaction, native dialog behavior, computed appearance, accessibility compliance, or mobile layout correctness. No assertions were weakened or skipped, and no application regressions were established by the blocked browser attempt.

## Required environment change and resumption

The environment owner/provider must restore a **supported managed preview runtime** in which the daemon can launch Vite and bind `127.0.0.1:4173` through its normal permissions, then return a browser-accessible preview URL. This is a repair request, not a request to disable security controls. Outbound network permission or a successful production build alone will not resolve or verify this local bind operation.

There is no proven application-code change to make for this failure. Repair/reprovision the preview-capable environment through its supported environment settings or provider support, retaining this checkout/branch. Do not deploy as a substitute. Once an actual infrastructure repair is confirmed, run `sites-preview start /workspace/EC-P`, open its exact returned URL, record browser/version and actual viewport for each row, and replace BLOCKED only with observed PASS/FAIL plus evidence. The browser regression task is **not complete**.
