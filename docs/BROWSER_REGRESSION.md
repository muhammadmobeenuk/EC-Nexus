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

## Reinvestigation E3 — 18 November 2026

**Outcome: BLOCKED. Merge recommendation: keep PR #1 in draft; do not merge until the browser matrix can be executed and any failures addressed.** GitHub conflict-free status is not evidence of browser readiness.

Verified `/workspace/EC-P`, branch `feat/prototype-foundation`, and clean working tree at documentation commit `502f5d7cd4a12f1dae61f558b88170df1e9ee6cf` before investigation. PR #1 remained open, draft, unmerged, and based on `main`; its reported head matched this commit. Application code remains at the foundation implementation from `dcf8703`.

### Configuration and supported alternatives

`package.json` still specifies `dev: vite --host 0.0.0.0` and `preview: vite preview --host 0.0.0.0`. No tracked Vite/config override file was found using `git ls-files '*vite*' '*.config.*'`, and no project Vite configuration appeared in the file search. The existing hosting manifest still selects static `dist/` and is unchanged.

`sites-preview --help` advertises only `start SITE_ROOT`, `status`, and `stop`; it has no supported host/port selector or repair command. The managed launcher appends `--host 127.0.0.1 --port 4173 --strictPort` to the dev script. The resulting error names that loopback address. The two host flags are visible configuration evidence, not proof of the EPERM cause.

No documented alternate preview configuration applicable to this checkout was advertised. Replacing the managed daemon with a separate server, overriding the port through application changes, omitting the dev script to change serving modes, or changing execution permissions would not diagnose a verified application defect and was not attempted. The normal `npm run preview` script was inspected, not launched as an infrastructure workaround.

### Exact diagnostic commands and observed results

| Command / supported API                                           | Observed result                                                                                                                                                                                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pwd`                                                             | `/workspace/EC-P`                                                                                                                                                                                                               |
| `git status --short`                                              | Empty before investigation; clean working tree.                                                                                                                                                                                 |
| `git branch --show-current`                                       | `feat/prototype-foundation`                                                                                                                                                                                                     |
| `git rev-parse HEAD`                                              | `502f5d7cd4a12f1dae61f558b88170df1e9ee6cf`                                                                                                                                                                                      |
| `cat package.json`                                                | Vite dev/build/preview and Node test scripts as described above.                                                                                                                                                                |
| `git ls-files '*vite*' '*.config.*'`                              | No matching tracked configuration files.                                                                                                                                                                                        |
| `sites-preview status`                                            | `Sites preview stopped` before and after startup attempt.                                                                                                                                                                       |
| `sites-preview start /workspace/EC-P`                             | Reproduced `listen EPERM: operation not permitted 127.0.0.1:4173`; same Vite invocation and Node stack as E1. No URL returned.                                                                                                  |
| `sites-preview --help`                                            | `usage: sites-preview <start SITE_ROOT\|status\|stop>`                                                                                                                                                                          |
| `ss -ltn 'sport = :4173'`                                         | `Cannot open netlink socket: Operation not permitted`; listener inspection unavailable through this tool. Empty displayed rows cannot be treated as a successful socket inventory.                                              |
| `cat /proc/net/tcp /proc/net/tcp6`                                | Headers only; no TCP entries visible in this execution context. This cannot exclude listeners in another managed runtime/network namespace.                                                                                     |
| `printenv SITES_MANAGED_LINUX_CONTAINER`                          | `1` — managed preview guidance applies.                                                                                                                                                                                         |
| `rg '^(NoNewPrivs\|Seccomp\|Seccomp_filters):' /proc/self/status` | `NoNewPrivs: 1`, `Seccomp: 2`, `Seccomp_filters: 2`. Restrictions are active; their presence alone does not identify the denying filter or syscall.                                                                             |
| `node node_modules/vite/bin/vite.js --version`                    | `vite/7.3.8 linux-x64 node-v24.22.1`                                                                                                                                                                                            |
| Environment status API                                            | Matching environment running/connected; current observation, unrestricted outbound network policy, no reported failure, only SSH portal advertised. These do not establish local socket-listen permission or preview readiness. |
| Environment diagnostics API, metadata only                        | `history_status: not_found`, no retained records, no legacy snapshot. No further startup capture available through this API.                                                                                                    |

### Diagnosis and confidence

- **Observed proximate cause — high confidence:** the supported managed preview process cannot establish its requested listening socket at `127.0.0.1:4173`; Node returns EPERM. The denial prevents any preview URL and therefore browser testing.
- **Environmental rather than application-level — high confidence:** the failure is a socket permission error; a separate socket-inspection operation is also denied. Vite's executable/version and production compilation work. No application configuration or compilation defect was observed that explains EPERM. The app and build were not changed to compensate.
- **Port already occupied — low support:** no listener is visible in the accessible TCP tables, and the error is EPERM rather than EADDRINUSE. Namespace limits and the denied netlink inventory mean occupancy cannot be ruled out globally. There is no evidence justifying killing a process or selecting another port.
- **Exact underlying cause — unconfirmed:** the visible security restrictions are consistent with denied socket operations, but the specific denying policy, syscall, and responsible managed component cannot be identified from the available diagnostics. No claim that a particular seccomp rule or firewall caused the failure is made.

**Required provider action:** repair or reprovision the supported preview-capable runtime so its daemon-owned Vite process can perform the normal approved local bind/listen operation and return its authorized browser URL. Supply the environment ID above and the E1/E3 output to provider support. Preserve the repository and branch. Do not remove security controls, change OS/firewall/sandbox permissions, or deploy to make the tests run. Retry only after a concrete provider repair or evidence of infrastructure recovery.

### Current validation and gaps

All rows in the browser matrix remain **BLOCKED** on 18 November: no browser, no executed viewport, no screenshots, no browser PASS/FAIL observations. This includes both colour schemes, 320px/390px/tablet/desktop layout, typography and horizontal overflow, patient/caregiver/clinician journeys, error/unfinished states, simulated medical behavior, native dialogs, focus restoration, and keyboard controls. No application regression has been established by this blocked attempt.

The following were independently rerun successfully on 18 November, before this documentation-only update: `npm test` (one passing test-file container), `node tests/foundation.test.js` (21 passed, 0 failed, 0 skipped), `npm run build`, `node scripts/verify-foundation.mjs`, and `git diff --check`. Working/staged whitespace checks were also run on the documentation update. Automated test success does not satisfy any browser matrix row.

Physical Android/iOS devices, screen readers, switch input, 200% text scaling, native dialog/keyboard accessibility, all cross-theme viewport measurements, and full accessibility/clinical validation remain outstanding. No application code, test expectations, clinical boundary, design token, hosting manifest, OS/network configuration, or security control changed. Only this report and the foundation audit were updated.
