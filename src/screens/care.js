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
export function createCareScreens(
  state,
  patientPicker,
  { now = Date.now } = {},
) {
  const elapsed = () => formatElapsed(state.record, now());
  const eventRows = () =>
    state.entries
      .map(
        (e, i) =>
          `<div class="row"><div><h3>${e.date}</h3><p>${e.source} · ${e.onset === "Unknown" ? "Timing unknown" : "Estimated timing"}</p>${pill(e.status, e.status === "Needs review")}</div><button class="btn" data-event="${e.id}" aria-label="Review event ${e.date}">Review →</button></div>`,
      )
      .join("");
  function home() {
    if (state.role === "Caregiver" && (!state.selectedPatient || state.revoked))
      return patientPicker();
    if (state.role === "Clinician")
      return (
        heading(
          "CLINICIAN VIEW · SIMULATED ACCESS",
          "A clearer view of care.",
          "Alex Lane · fictional patient",
        ) +
        note(
          "Example access scope: report and history review only. No clinical decisions or recommendations are generated.",
        ) +
        `<div class="grid"><section class="card"><h2>Patient-generated information</h2>${chart()}${link("Open clinical report", "reports", true)}</section><section class="card"><h2>Review priorities</h2><p>One incomplete event has unknown timing and an unanswered check-in.</p>${link("Review source records", "diary")}${note("Sharing access: illustrative only. No real patient connection.")}</section></div>`
      );
    return (
      heading(
        state.role === "Caregiver"
          ? "CAREGIVER SPACE · SAM RIVERS"
          : "TUESDAY, 17 NOVEMBER · DEMO DAY",
        state.role === "Caregiver"
          ? "Care, together."
          : "Your day. At your pace.",
        state.role === "Caregiver"
          ? "Supporting Alex Lane · fictional patient"
          : "Welcome back, Alex. Make space for what matters.",
        pill("YOUR PERSONAL SPACE"),
      ) +
      (state.role === "Caregiver"
        ? note(
            `Example permission: ${state.revoked ? "revoked — diary assistance unavailable" : "assisted recording and diary review"}. ${link("Review permissions", "privacy")}`,
          )
        : "") +
      `<div class="grid"><div><section class="card hero"><div><p class="eyebrow">HERE WHEN YOU NEED IT</p><h2>One moment.<br>A little more clarity.</h2><p>Record what you know. You can fill in the details when you’re ready.</p></div>${link(state.role === "Caregiver" ? "Record for Alex" : "Record an episode", "record")}</section><div class="stat-grid"><div class="stat"><strong>${state.entries.length}</strong><span>Example records</span></div><div class="stat"><strong>${state.entries.filter((e) => e.status === "Needs review").length}</strong><span>Awaiting review</span></div><div class="stat"><strong>—</strong><span>Clinical assessment</span></div></div><section class="card"><div class="section-title"><h2>Recent moments</h2><a href="#diary">View diary →</a></div>${state.role === "Caregiver" && state.revoked ? note("Diary access revoked in this demo.") : eventRows()}</section></div><div><section class="card"><div class="section-title"><h2>Today’s medication</h2>${ico("medication")}</div><p class="muted">Fictional schedule · 17 November</p><div class="row"><div><h3>Sample medicine A</h3><p>08:00 · dose intentionally omitted</p></div>${pill(state.doses[0], state.doses[0] === "Pending")}</div><div class="row"><div><h3>Sample medicine A</h3><p>20:00 · dose intentionally omitted</p></div>${pill(state.doses[1], state.doses[1] === "Pending")}</div><div class="actions">${link("View schedule", "medication")}</div></section><section class="card"><p class="eyebrow">YOUR CARE, IN ONE PLACE</p><h2>A plan you can find.</h2><p class="muted">See how a personal action plan could be accessed and reviewed.</p>${link("Explore sample plan →", "plan")}</section><section class="card" style="background:var(--soft)"><h2>No rush to finish.</h2><p class="muted">A recovery check-in is optional. Return whenever you feel ready.</p>${link("Open check-in", "recovery")}</section></div></div>`
    );
  }
  function recorder() {
    if (
      state.role === "Clinician" ||
      (state.role === "Caregiver" && state.revoked)
    )
      return (
        heading(
          "PERMISSION BOUNDARY",
          "Recording unavailable",
          "This demonstration role does not have recording permission.",
        ) + link("Return to overview", "home")
      );
    if (!state.record)
      return (
        heading(
          "SMART EPISODE RECORDER",
          "Start with what you know.",
          "This records a demo interaction, not a detected seizure.",
        ) +
        `<section class="card recordbox"><h2>Choose a candidate interaction</h2><p class="muted">Neither method is an approved default. Both need accessibility evaluation.</p><label class="field">Activation method<select id="method"><option value="direct">Single tap / keyboard activation</option><option value="confirm">Tap, then confirm</option></select></label><button class="recordcircle" data-action="begin" aria-label="Start demo recording">${ico("record")}<span>Start recording</span></button>${note("Activation time is when this control is used. Seizure onset and end remain unknown until explicitly estimated.")}${link("Log a past fictional event", "past")}</section>`
      );
    return (
      heading(
        "RECORDING SESSION",
        state.record.state === "active"
          ? "Recording is active."
          : state.record.state === "unfinished"
            ? "Recording unfinished."
            : "Recording stopped.",
        "Recorder activity does not establish whether a seizure is occurring.",
      ) +
      `<section class="card recordbox">${pill(state.record.state === "active" ? "Recorder active" : state.record.state === "unfinished" ? "Status unknown" : "Recorder stopped", state.record.state === "unfinished")}<div class="timer" id="timer">${elapsed()}</div><p class="center muted">Recorder elapsed time · not seizure duration</p><div class="row"><span>Activation timestamp</span><strong>${state.record.activation}</strong></div><div class="row"><span>Seizure onset / end</span><strong>Unknown / unknown</strong></div>${state.record.check ? note("Check-in unanswered. Seizure status remains unknown. No one has been notified.", true) : ""}<div class="actions">${state.record.state === "active" ? btn("Stop recorder", "stop", true) + btn("Show sample check-in", "check") + btn("Leave unfinished", "unfinished") : btn("Save demo record", "save", true)}</div>${note("No emergency assistance is requested by any action in this prototype.")}</section>`
    );
  }
  function detail() {
    let e = state.entries.find((e) => e.id === state.selected);
    if (!e)
      return heading(
        "EPISODE DETAIL",
        "Record unavailable",
        "Return to the diary to select a record.",
      );
    return (
      heading("EPISODE DETAIL", e.date, e.source + " · synthetic record") +
      `<div class="grid"><section class="card"><h2>What was recorded</h2><div class="row"><span>Activation</span><strong>${e.activation}</strong></div><div class="row"><span>Estimated onset</span><strong>${e.onset}</strong></div><div class="row"><span>Estimated end</span><strong>${e.end}</strong></div><div class="row"><span>Check-in</span><strong>${e.check}</strong></div><p class="muted" style="margin-top:20px">${e.notes}</p>${note("No clinical classification assigned. Recorder elapsed time is not used as seizure duration.")}<div class="actions">${state.role === "Clinician" ? "" : btn("Apply fictional timing correction", "correct") + btn("Mark accidental", "accidental")}${link("Recovery check-in", "recovery")}${link("Back to diary", "diary")}</div></section><section class="card"><h2>Record provenance</h2>${e.history.map((h) => `<div class="row"><p>${h}</p></div>`).join("")}${note("Corrections retain original observations in this session. Nothing is silently deleted.")}</section></div>`
    );
  }
  function medication() {
    return (
      heading(
        "MEDICATION",
        "A little everyday support.",
        "Example schedule only. No dosage or treatment advice.",
      ) +
      `<div class="grid"><section class="card"><h2>Tuesday, 17 November</h2>${state.doses.map((s, i) => `<div class="row"><div><h3>Sample medicine A · ${i ? "20:00" : "08:00"}</h3><p>Dose omitted from fictional plan</p>${pill(s, s === "Pending")}<div class="actions">${btn("Taken", `dose${i}taken`)}${btn("Missed", `dose${i}missed`)}</div></div></div>`).join("")}${note("Reminder preview: “You have a medication diary entry to review.” No reminder is scheduled or delivered.")}</section><section class="card"><h2>History & observations</h2><p>${state.doses.filter((d) => d === "Taken").length} taken · ${state.doses.filter((d) => d === "Missed").length} missed · ${state.doses.filter((d) => d === "Pending").length} pending</p><p class="muted">Illustrative completion only; not an adherence assessment.</p><label class="field">Fictional side-effect entry<select id="symptom"><option>Not sure</option><option>Example: tiredness</option><option>Prefer not to say</option></select></label>${btn("Save example observation", "sideeffect")}${link("Sample rescue plan concept", "plan")}<div id="sideeffectResult"></div></section></div>`
    );
  }
  function privacy() {
    return (
      heading(
        "PRIVACY & ACCESS",
        "Your information. Your choice.",
        "Every action here affects this demo session only.",
      ) +
      `<div class="grid"><section class="card"><h2>People with example access</h2><div class="row"><div><h3>Sam Rivers · caregiver</h3><p>Assisted recording & diary · fictional scope</p>${pill(state.revoked ? "Revoked (demo)" : "Active (demo)", state.revoked)}</div>${btn(state.revoked ? "Restore demo" : "Review & revoke", "revoke")}</div><div class="row"><div><h3>Clinician report</h3><p>${state.sharing} · demo only</p></div>${link("Sharing preview", "sharing")}</div><div class="actions">${btn("Preview invitation", "invite")}</div>${note("Child, guardian and witness access rules remain research decisions.")}</section><section class="card"><h2>Data controls</h2><p id="privacyStatus">${state.privacyState}</p><div class="actions">${btn("Request export", "export")}${btn("Request deletion", "delete")}</div>${note("No real account, export job or deletion request is created. Retention and deletion policy is unresolved.")}</section><section class="card"><h2>Example access history</h2><div class="row"><div><h3>Sam viewed shared diary</h3><p>16 Nov · 14:50 · fictional audit event</p></div></div><div class="row"><div><h3>Alex reviewed a record</h3><p>16 Nov · 15:20 · fictional audit event</p></div></div>${state.revoked ? "<p>Caregiver access revoked in this demo session.</p>" : ""}</section></div>`
    );
  }
  function reports() {
    return (
      heading(
        "REPORTS & INSIGHTS",
        "Patterns, with perspective.",
        "Fictional patient-generated information · no clinical interpretation",
      ) +
      `<div class="grid"><section class="card"><h2>Recorded events</h2>${chart()}<details><summary>View accessible data table</summary><table><thead><tr><th>Month</th><th>Records</th></tr></thead><tbody>${["August:4", "September:2", "October:5", "November (partial):3"].map((x) => `<tr><td>${x.split(":")[0]}</td><td>${x.split(":")[1]}</td></tr>`).join("")}</tbody></table></details></section><section class="card"><h2>Report overview</h2><p>Alex Lane · fictional identity</p><p>${state.entries.length} session records · ${state.entries.filter((e) => e.onset === "Unknown").length} with unknown onset</p><p>Estimated durations are shown only when both endpoints are provided. No population risk or treatment score.</p>${link("Preview clinical report", "report-preview", true)}</section><section class="card"><h2>Possible patterns</h2><p class="muted">Example note: “Sleep was mentioned alongside two diary entries.”</p>${note("An association does not establish a trigger or cause. This example is not calculated from session data.")}${link("Calendar view", "calendar")}</section><section class="card"><h2>Medication diary summary</h2><p>${state.doses.filter((d) => d === "Taken").length} of 2 example entries marked taken.</p><p class="muted">Pending entries are not assumed missed. This is not a treatment assessment.</p>${link("Time-limited sharing concept", "sharing")}</section></div>`
    );
  }
  function more() {
    return (
      heading(
        "EXPLORE",
        "Care, from every angle.",
        "Browse the full vision and the decisions still ahead.",
      ) +
      `<section class="card viewlist">${[
        ["plan", "Action plan"],
        ["reports", "Reports & insights"],
        ["privacy", "Privacy & access"],
        ["wearable", "Wearable concept"],
        ["recovery", "Recovery check-in"],
        ["settings", "Accessibility & appearance"],
        ["young", "Child & teen concept"],
        ["scenarios", "Offline & error scenarios"],
        ["guide", "Prototype guide & decisions"],
        ["welcome", "Welcome & onboarding"],
      ]
        .map(([id, t]) => link(t + " →", id))
        .join("")}</section>`
    );
  }
  function guide() {
    return (
      heading(
        "PROTOTYPE GUIDE",
        "The vision. The boundaries.",
        "PRD v0.1 · 17 November 2026 · discovery baseline",
      ) +
      `<section class="card"><h2>Start exploring</h2><div class="viewlist">${link("A · Record and recover", "record")}${link("B · Caregiver: choose role above", "home")}${link("C · Review and correct history", "diary")}${link("D · Medication diary", "medication")}${link("E · Clinician report", "reports")}${link("F · Wearable concept", "wearable")}${link("G · Privacy management", "privacy")}</div></section><section class="card"><h2>Design decisions & open questions</h2><p><b>Confirmed:</b> full-vision demo, fictional data, optional recovery and device-following appearance.</p><p><b>Proposed:</b> single-tap and tap-confirm activation candidates; layouts, sample permissions and sample check-in wording.</p><p><b>Scope clarification:</b> “request assistance”, “export”, “delete” and “share” show simulated outcomes only. Wearable support is unnamed and fictional. Child/teen screens demonstrate language, not settled access policy.</p>${["SAFE-01 / 02 · Seizure classification and uncertain-event terminology", "SAFE-03 · Default activation and accessibility evaluation", "SAFE-04 / 05 · Check-in timing, questions, notifications and escalation", "SAFE-06 · Unregistered witness access", "SAFE-07 / 08 · Action-plan verification and rescue-content governance", "SAFE-09 · Child and guardian permissions", "SAFE-10 / 11 · Wearable evidence and future AI medical functionality", "SAFE-12 · Production retention, deletion and UK privacy review"].map((s) => `<details><summary>${s}</summary><p>Research required. Not resolved or implemented as clinical functionality in this prototype.</p></details>`).join("")}</section><section class="card"><h2>Initial accessibility review</h2><p>Implemented: semantic buttons, labelled inputs, visible focus, keyboard operation, minimum 44px principal controls, responsive reflow, system themes, no flashing or motion.</p><p>Still to validate: full WCAG 2.2 review, screen readers, browser text scaling, post-episode cognitive load, one-handed use and activation alternatives with participants.</p><h2>Research boundaries</h2><p>Use fictional tasks only. Do not imitate or induce seizures. Participation must be voluntary, skippable and supported by a separate consent and research-data plan.</p><p>No analytics, clinical accounts, backend synchronization, monitoring or external integrations are included.</p></section>`
    );
  }
  return {
    home,
    recorder,
    detail,
    medication,
    privacy,
    reports,
    more,
    guide,
    eventRows,
  };
}
