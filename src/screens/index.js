import {
  ico,
  btn,
  link,
  pill,
  note,
  heading,
  chart,
} from "../ui/components.js";
import { formatElapsed } from "../domain/recorder.js";
import { createCareScreens } from "./care.js";
import { createReferenceScreens } from "./reference.js";
export function createScreens(state, { now = Date.now } = {}) {
  const reference = createReferenceScreens(state);
  const {
    home,
    recorder,
    detail,
    medication,
    privacy,
    reports,
    more,
    guide,
    eventRows,
  } = createCareScreens(state, reference.patientPicker, { now });
  const routes = {
    home: () => {
      return home();
    },
    record: () => {
      return recorder();
    },
    confirm: () => {
      return (
        heading(
          "CANDIDATE INTERACTION",
          "Ready to start?",
          "This confirmation method is for comparison in usability research.",
        ) +
        `<section class="card">${btn("Confirm demo recording", "start", true)} ${link("Cancel", "record")}</section>`
      );
    },
    check: () => {
      return (
        heading(
          "SAMPLE CHECK-IN",
          "Would you like to add an update?",
          "Example wording and timing are not clinically approved.",
        ) +
        `<section class="card recordbox"><p>The recorder is preserved while this prompt is open.</p>${note("Not responding gives no information about seizure continuation or completion.", true)}<div class="actions">${btn("Leave unanswered", "unanswered", true)}${link("Return to recorder", "record")}${btn("Stop recorder", "stop")}</div><p class="muted">No caregiver or emergency notification will be sent.</p></section>`
      );
    },
    saved: () => {
      return (
        heading(
          "DEMO RECORD SAVED",
          "The details can wait.",
          "Seizure timing remains unknown unless explicitly provided.",
        ) +
        `<section class="card recordbox">${pill("Saved in this session")}<div class="actions">${link("Optional recovery check-in", "recovery", true)}${link("Review later · open diary", "diary")}</div></section>`
      );
    },
    recovery: () => {
      return (
        heading(
          "RECOVERY CHECK-IN",
          "Take your time.",
          "Optional questions. You can skip everything and return later.",
        ) +
        `<section class="card recordbox"><label class="field">Example wellbeing response<select id="wellbeing"><option>Not sure</option><option>Would like support</option><option>Prefer not to say</option></select></label><label class="field">Example symptom response<select><option>Leave unknown</option><option>Example: tiredness</option><option>Prefer not to say</option></select></label>${note("This does not assess clinical stability or readiness for activity.")}<div class="actions">${btn("Save example check-in", "recover", true)}${btn("Preview caregiver assistance", "assist")}${btn("Review reminder concept", "reminder")}${link("Skip for now", "diary")}</div><p class="muted">Current demo status: ${state.recovery}</p></section>`
      );
    },
    diary: () => {
      return (
        heading(
          "EPISODE DIARY",
          "Your story, at your pace.",
          "Unknown details are welcome. Nothing needs to be perfect.",
          link("Calendar", "calendar"),
        ) +
        `<section class="card">${state.role === "Caregiver" && state.revoked ? note("Demo permission denied. Caregiver access has been revoked.") : eventRows()}<div class="actions">${link("Record an episode", "record", true)}${link("Possible duplicate example", "duplicate")}</div></section>`
      );
    },
    detail: () => {
      return state.role === "Caregiver" && state.revoked
        ? note("Access denied in this demo.")
        : detail();
    },
    calendar: () => {
      return (
        heading(
          "DIARY CALENDAR",
          "November 2026",
          "Underlined dates contain fictional events.",
        ) +
        `<section class="card"><div class="calendar">${["M", "T", "W", "T", "F", "S", "S"].map((d) => `<span>${d}</span>`).join("")}${Array(6).fill("<span></span>").join("")}${Array.from({ length: 30 }, (_, i) => `<button data-day="${i + 1}" ${state.entries.some((e) => e.calendarDate === `2026-11-${String(i + 1).padStart(2, "0")}`) ? 'class="event"' : ""} aria-label="November ${i + 1}${state.entries.some((e) => e.calendarDate === `2026-11-${String(i + 1).padStart(2, "0")}`) ? ", example event" : ""}">${i + 1}</button>`).join("")}</div><div id="dayResult" class="notice">Select a date to browse.</div></section>`
      );
    },
    medication: () => {
      return medication();
    },
    privacy: () => {
      return privacy();
    },
    reports: () => {
      return reports();
    },
    plan: () => {
      return (
        heading(
          "SEIZURE ACTION PLAN",
          "A plan, close at hand.",
          "Display concept only · no individualized treatment instructions",
        ) +
        `<section class="card"><div class="section-title"><h2>Alex’s sample plan</h2>${pill("NOT CLINICALLY APPROVED", true)}</div><div class="row"><span>Source</span><strong>Fictional demonstration</strong></div><div class="row"><span>Version</span><strong>Example 0.1</strong></div><div class="row"><span>Verification / review</span><strong>Not verified</strong></div><details open><summary>What this plan could contain</summary><p>Authorized clinical instructions, relevant contacts, review date and version history would appear here after governance is agreed.</p></details><details><summary>Rescue-medication plan concept</summary><p>No medicine, dose, route or timing instructions are provided. Authorized source and content governance remain unresolved.</p></details>${note("This sample cannot be used during an actual emergency. The prototype does not contact anyone.", true)}${link("Read unresolved decisions", "guide")}</section>`
      );
    },
    wearable: () => {
      return (
        heading(
          "FUTURE CONNECTIONS",
          "Another piece of the picture.",
          "Concept only · no device discovery or monitoring",
        ) +
        `<div class="grid"><section class="card"><p class="eyebrow">FICTIONAL WEARABLE</p><h2>Demo wrist device</h2><div class="recordcircle">${ico("wearable")}</div><p class="center">${state.device}</p><div class="actions">${btn("Simulate connection", "connect", true)}${btn("Simulate disconnect", "disconnect")}${btn("Unsupported device", "unsupported")}</div>${note("No named device support or detection accuracy is claimed. Permissions shown are illustrative.")}</section><section class="card"><h2>Possible-event review</h2><p>Example device signal · 17 Nov, 10:24</p>${pill(state.deviceReview, true)}${note("A device-suspected signal is not a confirmed seizure. Devices may miss events or raise false alerts.")}<div class="actions">${link("Review possible event", "device-review")}</div></section></div>`
      );
    },
    "device-review": () => {
      return (
        heading(
          "UNCONFIRMED DEVICE SIGNAL",
          "Review what you know.",
          "This is a simulated notification, not detection.",
        ) +
        `<section class="card"><p>Source: fictional wearable · Example signal at 10:24</p>${pill(state.deviceReview, true)}<div class="actions">${btn("Keep uncertain", "uncertain")}${btn("Mark not an episode", "dismiss-device")}${btn("Create suspected diary entry", "device-save", true)}${link("Compare possible duplicate", "duplicate")}</div></section>`
      );
    },
    duplicate: () => {
      return (
        heading(
          "RECORD RECONCILIATION",
          "Could these be related?",
          "Two fictional sources may refer to one event. No automatic merge.",
        ) +
        `<section class="card"><div class="row"><span>Patient report</span><span>10:25 · estimated</span></div><div class="row"><span>Device-suspected signal</span><span>10:24 · unconfirmed</span></div>${note("Original source records would remain available. Reconciliation rules require further review.")}<div class="actions">${btn("Preview a linked pair", "link-pair")}${link("Keep separate", "diary")}</div></section>`
      );
    },
    sharing: () => {
      return (
        heading(
          "REPORT SHARING",
          "Access with boundaries.",
          "Time-limited sharing concept · no link is sent or activated",
        ) +
        `<section class="card"><label class="field">Example expiry<select id="expiry"><option>7 days (illustration)</option><option>24 hours (illustration)</option></select></label><p>Scope: fictional report only. Recipient identity and verification rules remain undecided.</p><p>Status: ${state.sharing}</p><div class="actions">${btn("Create demo sharing state", "share", true)}${btn("Revoke demo sharing", "unshare")}</div></section>`
      );
    },
    "report-preview": () => {
      return (
        heading(
          "CLINICAL REPORT PREVIEW",
          "Alex Lane",
          "FICTIONAL REPORT · NOT FOR CLINICAL USE",
        ) +
        `<section class="card"><h2>Patient-generated episode summary</h2><p>${state.entries.length} records. Unknown values retained. Sources: patient reports, caregiver observations and any simulated device entries.</p>${eventRows()}${note("No diagnosis, treatment advice or validated clinical assessment. Charts elsewhere are fixed illustrations.")}<div class="actions">${btn("Preview PDF-export outcome", "pdf")}${link("Sharing options", "sharing")}</div></section>`
      );
    },
    settings: () => {
      return (
        heading(
          "ACCESSIBILITY & APPEARANCE",
          "Comfort, by design.",
          "The prototype follows your device’s light or dark appearance.",
        ) +
        `<section class="card"><h2>Appearance follows your phone</h2><p>Change your device appearance to preview Modern Wellness or Premium Midnight. There is no saved manual theme override.</p><h2>Interaction support</h2><ul class="checklist"><li>Readable text, responsive layouts and labelled controls.</li><li>Keyboard focus indicators and a skip-to-content link.</li><li>No flashing, autoplay, decorative animation or sound.</li><li>Status uses words as well as colour.</li><li>Use browser text scaling or zoom as needed.</li></ul>${note("Accessibility review is initial and incomplete. Screen-reader, motor-access and lived-experience testing are still required. No full-compliance claim.")}${link("Compare recorder activation methods", "record")}</section>`
      );
    },
    young: () => {
      return (
        heading(
          "CHILD & TEEN PREVIEW",
          "Growing independence.",
          "Concept preview · no real age or guardian information collected",
        ) +
        `<section class="card"><h2>A simpler diary</h2><p>“Add what you remember. It’s okay if you’re not sure.”</p>${link("Explore optional check-in", "recovery")}${note("Who can view, edit, consent or revoke access is unresolved. No automatic guardian access is assumed.", true)}<h3>Proposed research areas</h3><p class="muted">Age-appropriate language, safeguarding, consent and evolving autonomy.</p></section>`
      );
    },
    scenarios: () => {
      return (
        heading(
          "RESILIENCE SCENARIOS",
          "When things don’t go to plan.",
          "Manually selected demonstrations, not real sync or service states.",
        ) +
        `<section class="card"><div class="viewlist">${btn("Offline example", "offline")}${btn("Save error example", "error")}${btn("Permission denied", "denied")}${btn("Empty diary", "empty")}</div><div id="scenario" class="notice">Choose a scenario.</div></section>`
      );
    },
    welcome: () => {
      return (
        heading(
          "WELCOME TO EPILEPSY CARE",
          "A little clarity. Every day.",
          "A fictional-data prototype built around recording, reflection and support.",
        ) +
        `<section class="card"><h2>Explore a perspective</h2><p>Use the role selector to explore patient, caregiver and clinician journeys. No sign-in or personal information is needed.</p>${note("By exploring, you are not enrolling in research or consenting to data collection. Participant research needs a separate approved consent process.")}<div class="actions">${link("Explore patient overview", "home", true)}${link("Read prototype guide", "guide")}</div></section>`
      );
    },
    past: () => {
      return (
        heading(
          "PAST EVENT CONCEPT",
          "Unknown is a valid answer.",
          "Create a fictional historical entry without inventing onset or duration.",
        ) +
        `<section class="card">${btn("Add fictional past event · timing unknown", "past-save", true)}</section>`
      );
    },
    guide: () => {
      return guide();
    },
    more: () => {
      return more();
    },
    fallback: () => {
      return (
        heading(
          "PAGE UNAVAILABLE",
          "Let’s get you back.",
          "This destination is not part of the prototype.",
        ) + link("Return home", "home")
      );
    },
    design: reference.designSystem,
    evidence: reference.evidence,
    "screen-map": reference.architecture,
    patients: reference.patientPicker,
    profile: reference.profile,
    contrast: reference.contrast,
  };
  return { routes, reference };
}
