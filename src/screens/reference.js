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
export function createReferenceScreens(state) {
  const screenMap = [
    ["01–03", "Welcome, roles and onboarding", "welcome"],
    ["04", "Patient overview", "home"],
    ["05–09", "Recorder ready, active, check-in, unfinished, saved", "record"],
    ["10–11", "Recovery and optional questions", "recovery"],
    ["12–14", "Diary, corrections and calendar", "diary"],
    ["15–17", "Medication, schedule and observations", "medication"],
    ["18", "Sample action plan", "plan"],
    ["19–20", "Insights and reports", "reports"],
    ["21", "Privacy and access history", "privacy"],
    ["22", "Accessibility and device appearance", "settings"],
    ["23–25", "Caregiver introduction and patient selection", "patients"],
    ["26–29", "Assisted recording, history, permissions and recovery", "home"],
    ["30–35", "Clinician overview, reports and sharing", "reports"],
    ["36", "Child / teen language concept", "young"],
    ["37–38", "Wearable connection and event review", "wearable"],
    ["39–40", "Offline, error, empty and denied states", "scenarios"],
  ];
  const sources = [
    [
      "Text contrast",
      "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum",
      "SC 1.4.3: normal text 4.5:1; large text 3:1.",
      "Check foreground/background pairs in both themes.",
    ],
    [
      "Target size",
      "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum",
      "SC 2.5.8: 24 × 24 CSS pixels or an applicable exception.",
      "Use 48px general controls and 56px primary controls as a design proposal, not a compliance claim.",
    ],
    [
      "Reflow",
      "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html",
      "SC 1.4.10 addresses a 320 CSS pixel viewport for vertically scrolling content.",
      "Stack columns; prevent fixed navigation from covering content.",
    ],
    [
      "Understandable content",
      "https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/",
      "Supplemental cognitive accessibility guidance; not an additional conformance standard.",
      "Use short instructions, explicit status and optional questions.",
    ],
  ];
  function patientPicker() {
    return (
      heading(
        "CAREGIVER · DEMO CONTEXT",
        "Who are you supporting?",
        "Choose a fictional profile before entering shared care.",
      ) +
      `<section class="card"><div class="person-card"><span class="avatar large">AL</span><div><h2>Alex Lane</h2><p class="muted">Fictional adult · example invitation accepted</p>${pill(state.revoked ? "Access revoked" : "Example access available", state.revoked)}</div></div><p>Scope preview: diary review, assisted recording and optional recovery. Medication and account controls belong to the patient.</p><div class="actions">${btn("Continue with Alex", "select-alex", true)}${link("Review example permissions", "privacy")}</div></section><section class="card"><h2>No other shared profiles</h2><p class="muted">You cannot search for or access arbitrary patients. Witness and guardian permissions are unresolved.</p></section>`
    );
  }
  function designSystem() {
    return (
      heading(
        "DESIGN SPECIFICATION · V0.2",
        "Calm. Clear. Connected.",
        "A living reference for the full-vision prototype.",
      ) +
      `<div class="design-tabs">${link("Foundations & components", "design", true)}${link("Screen architecture", "screen-map")}${link("Accessibility evidence", "evidence")}</div><section class="card"><p class="eyebrow">01 / COLOUR & APPEARANCE</p><h2>Two appearances. One familiar experience.</h2><p class="muted">App appearance follows the device. These side-by-side samples are reference specimens only.</p><div class="theme-pair"><div class="theme-sample wellness"><span class="eyebrow">MODERN WELLNESS</span><h2>Your care, in one place.</h2><p>Quiet surfaces. Clear next steps.</p><span class="sample-action">Record episode</span><div class="swatches"><span>#F5F7F2</span><span>#23785B</span><span>#18392B</span></div></div><div class="theme-sample midnight"><span class="eyebrow">PREMIUM MIDNIGHT</span><h2>Your care, in one place.</h2><p>Gentle contrast. Familiar controls.</p><span class="sample-action">Record episode</span><div class="swatches"><span>#101C2B</span><span>#1D3045</span><span>#83B5F8</span></div></div></div></section><section class="card"><p class="eyebrow">02 / FOUNDATIONS</p><div class="token-grid">${[
        ["Typography", "System sans · body 16px / 1.6"],
        ["Spacing", "4px grid · 8 / 12 / 16 / 24 / 32"],
        ["Shapes", "Cards 20px · buttons 14px"],
        ["Actions", "56px primary · 48px general"],
        ["Elevation", "Subtle border and soft shadow"],
        ["Motion", "No animation or flashing effects"],
      ]
        .map(([a, b]) => `<div><h3>${a}</h3><p class="muted">${b}</p></div>`)
        .join(
          "",
        )}</div></section><section class="card"><p class="eyebrow">03 / COMPONENT STATES</p><h2>Predictable controls</h2><div class="actions">${btn("Normal", "sample-normal", true)}<button class="btn" disabled>Disabled</button><button class="btn primary" disabled aria-busy="true">Saving… (sample)</button><button class="btn focus-sample" data-action="sample-normal">Focus specimen</button>${btn("Open sample dialog", "sample-dialog")}</div>${note("Saved · sample confirmation")}${note("Unable to save · sample error. Your draft would remain available.", true)}<label class="field">Example required field<input disabled value="Synthetic entry only" aria-describedby="field-help"></label><p class="muted" id="field-help">Inputs use visible labels and nearby guidance. No real health information is requested.</p><div class="actions">${pill("Saved")}${pill("Needs review", true)}${pill("Status unknown", true)}</div></section><section class="card"><p class="eyebrow">04 / NAVIGATION RESEARCH</p><h2>Compare the fifth destination</h2><p>Home / Diary / Record / Meds stays consistent. Compare “More” with “Profile” during testing. This session-only switch does not select a final architecture.</p><div class="actions">${btn("Preview More navigation", "nav-more")}${btn("Preview Profile navigation", "nav-profile")}</div>${note("Record navigation opens the ready screen; it never starts recording. The action plan is also available from the header and home dashboard.")}</section>`
    );
  }
  function evidence() {
    return (
      heading(
        "ACCESSIBILITY · INITIAL REVIEW",
        "Evidence into design.",
        "Reviewed 17 November 2026 · not a certification or clinical validation",
      ) +
      `<section class="card"><h2>Authoritative sources reviewed</h2>${sources.map(([title, url, criterion, implication]) => `<details open><summary>${title}</summary><p>${criterion}</p><p class="muted">Design implication: ${implication}</p><a href="${url}" target="_blank" rel="noopener">Read W3C guidance ↗</a></details>`).join("")}</section><section class="card"><h2>Interaction alternatives</h2><div class="table-wrap"><table><thead><tr><th>Candidate</th><th>Research question</th><th>Status</th></tr></thead><tbody>${[
        [
          "Single tap / keyboard",
          "Accidental activation versus speed",
          "Interactive candidate",
        ],
        [
          "Tap then confirm",
          "Extra effort versus confidence",
          "Interactive candidate",
        ],
        [
          "Press and hold",
          "Sustained motor control and cancellation",
          "Research only",
        ],
        [
          "Voice",
          "Privacy, speech access and reliability",
          "Research only; no microphone",
        ],
        [
          "Caregiver assistance",
          "Patient selection and scope clarity",
          "Simulated role",
        ],
      ]
        .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
        .join(
          "",
        )}</tbody></table></div></section><section class="card"><h2>Checks and remaining work</h2><ul class="checklist"><li>Implemented: keyboard-native controls, visible focus, labels, status text and no visual flashing.</li><li>Contrast: key token pairs measured in the accompanying check log. This does not cover every rendered state.</li><li>Responsive: phone layouts reviewed; full device and text-scaling matrix remains open.</li><li>Outstanding: TalkBack, VoiceOver, switch input, 200% text, reduced-motion preferences and all error-state journeys.</li><li>Outstanding: lived-experience research on post-episode fatigue, cognitive load and child/teen language.</li><li>No gesture is declared universally accessible. No clinical policy is inferred from these sources.</li></ul>${link("View local contrast results", "contrast")}</section>`
    );
  }
  function architecture() {
    return (
      heading(
        "FULL-VISION SCREEN MAP",
        "One connected experience.",
        "Every PRD destination is mapped below; related states share a screen.",
      ) +
      `<section class="card"><div class="table-wrap"><table><thead><tr><th>PRD screens</th><th>Experience / states</th><th>Explore</th></tr></thead><tbody>${screenMap.map(([n, t, u]) => `<tr><td>${n}</td><td>${t}</td><td>${link("Open →", u)}</td></tr>`).join("")}</tbody></table></div></section>${note("Child and teen access, autonomous AI, emergency escalation and clinical verification remain unapproved. Screen coverage does not mean production functionality is approved.")}`
    );
  }
  function profile() {
    return (
      heading(
        "YOUR SPACE",
        "Your preferences. Your people.",
        "Alex Lane · fictional adult profile",
      ) +
      `<section class="card"><div class="person-card"><span class="avatar large">AL</span><div><h2>Alex Lane</h2><p class="muted">Demo profile · no real account</p></div></div><div class="viewlist">${link("Privacy & sharing", "privacy")}${link("Accessibility & appearance", "settings")}${link("Sample action plan", "plan")}${link("All prototype features", "more")}${link("Design system v0.2", "design")}${link("Screen map", "screen-map")}</div></section>`
    );
  }
  const lum = (hex) => {
    const v = hex
      .match(/\w\w/g)
      .map((x) => parseInt(x, 16) / 255)
      .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  };
  const contrastPairs = [
    ["Light primary text / background", "18392B", "F5F7F2"],
    ["Light secondary text / white", "52675D", "FFFFFF"],
    ["Light button / white label", "23785B", "FFFFFF"],
    ["Dark text / surface", "FFFFFF", "1D3045"],
    ["Dark secondary / surface", "B2C3D4", "1D3045"],
    ["Dark action / label", "83B5F8", "101C2B"],
    ["Light amber status", "735221", "F6EDDA"],
    ["Dark amber status", "F0CF8C", "3C3424"],
  ].map((p) => [
    ...p,
    (Math.max(lum(p[1]), lum(p[2])) + 0.05) /
      (Math.min(lum(p[1]), lum(p[2])) + 0.05),
  ]);

  return {
    patientPicker,
    designSystem,
    evidence,
    architecture,
    profile,
    contrast: () =>
      heading(
        "COMPUTED TOKEN PAIRS",
        "Contrast check log.",
        "WCAG relative luminance calculation · normal-text benchmark 4.5:1",
      ) +
      `<section class="card"><p>These calculations cover declared colour pairs, not a full rendered accessibility audit.</p><div class="table-wrap"><table><thead><tr><th>Pair</th><th>Ratio</th><th>Normal text</th></tr></thead><tbody>${contrastPairs.map((p) => `<tr><td>${p[0]}</td><td>${p[3].toFixed(2)}:1</td><td>${p[3] >= 4.5 ? "Pass" : "Needs review"}</td></tr>`).join("")}</tbody></table></div></section>`,
  };
}
