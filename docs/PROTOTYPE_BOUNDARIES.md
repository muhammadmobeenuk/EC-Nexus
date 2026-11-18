# Prototype boundaries

Confirmed scope for the v0.2 foundation refactor, 17 November 2026. This document records the supplied task and inspected code; the separate discovery PRD is not present in this repository, so no additional PRD acceptance criteria are inferred.

## Confirmed behavior

- Frontend-only fictional demonstration with page-memory state, recreated on reload.
- Existing patient, caregiver, and clinician perspectives are demo contexts, not identities or authentication.
- Caregiver context selection precedes patient-specific routes. Existing revocation and medication/account-control restrictions apply to both rendering and action dispatch.
- Clinician mutation controls remain unavailable except the existing simulated PDF and sharing controls. Refinement-added design specimens remain interactive.
- Navigation does not activate a recorder. Both existing activation candidates remain research examples; neither is approved as the final gesture.
- Activation timestamps and original role/patient context are retained. Switching perspectives cannot silently reattribute a recording.
- Elapsed recorder time is separate from seizure timing. Unknown onset/end remain unknown when a recorder is stopped or unfinished. Unanswered check-ins imply no clinical conclusion.
- No default clinical classification, medical score, treatment advice, seizure detection, automatic check-in timing, escalation, or emergency notification.
- Recovery is optional. Fixed charts remain illustrative and do not derive clinical patterns from session records.
- Corrections and accidental markings retain original provenance; simulated deletion does not remove records.
- Sharing, invitations, export/PDF, assistance, reminders, wearable connection/signals, and duplicates retain their original simulated outcomes.
- No clinical accounts, persistence, synchronization, analytics, permissions/device APIs, real sharing, or backend integrations.
- The archived purple app is outside the default build. Its source/storage behavior remains intact; no stored data is read, cleared, or imported into v0.2.
- The Sites hosting manifest is unchanged. This task does not deploy, merge into main, change audiences, or enable automatic merge.

## Existing ambiguous demo scopes — not resolved here

The v0.2 text describes caregiver access narrowly, but some selected, non-revoked caregiver routes expose additional concept controls (for example retrospective/device-suspected records, reports, and PDF simulation). The refactor retains these existing previews rather than inventing a broader or narrower policy. The caregiver home also retains its read-only fictional medication summary while the medication editor is unavailable.

The clinician preview retains simulated sharing creation/revocation because the original app explicitly allowed those buttons. That is a concept interaction, not a clinical access decision. The patient-picker demonstration can still select a profile labelled revoked; the existing downstream revocation boundary prevents patient-specific access. These inconsistencies need product review before any real authorization is designed.

Preserving recorder attribution does not define the rights of real people sharing a role. The only patient context is the fictional Alex profile. No actual user, witness, guardian, or child identity exists.

## Decisions still open

- Seizure classifications and uncertain-event terminology (existing SAFE-01/02 references).
- Final activation gestures and accessibility evaluation (SAFE-03).
- Clinical check-in wording/timing, notifications, and escalation (SAFE-04/05).
- Unregistered witness access (SAFE-06).
- Action-plan verification, authorized sources, and rescue-content governance (SAFE-07/08).
- Child/teen/guardian consent, access, safeguarding, and evolving autonomy (SAFE-09).
- Wearable evidence, accuracy, and any future AI medical functionality (SAFE-10/11).
- Production retention, deletion, identity, authorization, and privacy review (SAFE-12).

The SAFE references are existing prototype labels, not evidence that requirements have been satisfied. No research gate is closed by this refactor. Participant consent and research recruitment remain separate from onboarding.
