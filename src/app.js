import { createHashRouter } from "./router.js";
import { createSession, entriesOnDay } from "./domain/session.js";
import { routeBoundary, canPerformAction } from "./domain/permissions.js";
import { formatElapsed } from "./domain/recorder.js";
import { createScreens } from "./screens/index.js";
import { ico, btn, link, note, heading } from "./ui/components.js";
import { dispatchAction } from "./actions.js";
/** Mount one isolated page session; dispose listeners/timers for tests or teardown. */
export function mountApp(
  document,
  window,
  { state = createSession(), now = Date.now } = {},
) {
  const $ = (s) => document.querySelector(s);
  const { routes, reference } = createScreens(state, { now });
  let toastTimer;
  function toast(text) {
    $("#toast").textContent = text;
    $("#toast").style.display = "block";
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(
      () => ($("#toast").style.display = "none"),
      5500,
    );
  }
  function go(route) {
    router.go(route);
  }
  function render(focus = false) {
    state.current = router.current();
    const current = state.current;
    const items = [
      ["home", "Overview"],
      ["diary", "Episode diary"],
      ["record", "Record an episode"],
      ["medication", "Medication"],
      ["plan", "Action plan"],
      ["reports", "Reports"],
      ["privacy", "Privacy & access"],
      ["more", "Explore more"],
      ["design", 'Design system <span class="pill">0.2</span>'],
    ];
    const nav = ([id, label]) =>
      `<a href="#${id}" ${current === id ? 'class="active" aria-current="page"' : ""}>${ico(id)}${label}</a>`;
    $("#sideNav").innerHTML = items.map(nav).join("");
    $("#bottomNav").innerHTML = [
      ["home", "Home"],
      ["diary", "Diary"],
      ["record", "Record"],
      ["medication", "Medication"],
      [
        state.navigationCandidate === "profile" ? "profile" : "more",
        state.navigationCandidate === "profile" ? "Profile" : "More",
      ],
    ]
      .map(nav)
      .join("");
    $("#breadcrumb").textContent =
      `${state.role} space / ${current.replaceAll("-", " ")}`;
    const boundary = routeBoundary(state);
    let html;
    if (boundary === "patient") html = reference.patientPicker();
    else if (boundary === "revoked")
      html =
        heading(
          "EXAMPLE ACCESS REVOKED",
          "Shared care is unavailable.",
          "No patient details are available in this caregiver preview.",
        ) + link("Review scope", "privacy");
    else if (boundary === "scope")
      html =
        heading(
          "EXAMPLE PERMISSIONS",
          "Outside your shared scope.",
          "This caregiver preview is limited to assisted recording, diary review and recovery.",
        ) + link("View example permissions", "privacy");
    else if (boundary === "clinician")
      html =
        heading(
          "READ-ONLY CLINICIAN PREVIEW",
          "Report access only.",
          "Patient account controls and diary mutations are outside this example scope.",
        ) + link("Open report", "reports");
    else if (boundary === "owner")
      html =
        heading(
          "RECORDING CONTEXT",
          "Another demo role started this recorder.",
          "Switch back to " +
            state.record.ownerRole +
            " to continue. The original activation and author are retained.",
        ) + link("Return to overview", "home");
    else if (state.role === "Caregiver" && current === "privacy")
      html =
        heading(
          "CAREGIVER PERMISSIONS",
          "Know your access.",
          "Fictional scope only; not a settled authorization policy.",
        ) +
        `<section class="card"><h2>Alex Lane</h2><span class="pill ${state.revoked ? "amber" : ""}">${state.revoked ? "Revoked in demo" : "Active in demo"}</span><p>Permitted preview: assisted recording, shared diary and recovery follow-up.</p><p>Medication changes, deletion, export and sharing controls are reserved for the patient preview.</p>${link("Choose patient", "patients")}${note("Switch to Patient to review or revoke this example grant.")}</section>`;
    else html = (routes[current] || routes.fallback)();
    if (!boundary && current === "more")
      html += `<section class="card"><h2>Design & review</h2><div class="viewlist">${link("Design system v0.2", "design")}${link("Accessibility evidence", "evidence")}${link("Full screen map", "screen-map")}${link("Profile concept", "profile")}${state.role === "Caregiver" ? link("Choose shared patient", "patients") : ""}</div></section>`;
    if (
      current === "home" &&
      state.role === "Caregiver" &&
      state.selectedPatient &&
      !state.revoked
    )
      html =
        `<div class="context-strip"><span>Supporting <b>Alex Lane</b> · fictional adult</span>${link("Change", "patients")}</div>` +
        html;
    if (state.record && !["record", "check", "saved"].includes(current))
      html =
        `<div class="context-strip"><span>Demo recorder: <b>${state.record.state}</b> · clinical status unknown</span>${link("Return", "record")}</div>` +
        html;
    if (!boundary && current === "record" && !state.record)
      html += `<div class="recordbox">${link("View sample action plan", "plan")}${link("Compare interaction research", "evidence")}</div>`;
    $("#main").innerHTML = html;
    $("#main")
      .querySelectorAll("[data-action]")
      .forEach((b) => {
        if (
          ![
            "select-alex",
            "nav-more",
            "nav-profile",
            "sample-normal",
            "sample-dialog",
            "close-dialog",
          ].includes(b.dataset.action) &&
          !canPerformAction(state, b.dataset.action)
        ) {
          b.disabled = true;
          b.title = "Unavailable in this demo context";
        }
      });
    if (focus) {
      $("#main").focus();
      window.scrollTo(0, 0);
    }
  }
  const ui = { document, render, go, toast, now };
  function click(e) {
    const skip = e.target.closest(".skip");
    if (skip) {
      e.preventDefault();
      $("#main").focus();
      return;
    }
    const ev = e.target.closest("[data-event]");
    if (ev) {
      if (routeBoundary(state, "detail")) return;
      const entry = state.entries.find((x) => x.id === ev.dataset.event);
      if (entry) {
        state.selected = entry.id;
        go("detail");
      }
      return;
    }
    const day = e.target.closest("[data-day]");
    if (day) {
      if (routeBoundary(state, "calendar")) return;
      const entries = entriesOnDay(state, day.dataset.day);
      $("#dayResult").innerHTML = entries.length
        ? entries
            .map(
              (entry) =>
                `Example event on ${day.dataset.day} November. <button class="btn" data-event="${entry.id}">Review event →</button>`,
            )
            .join("")
        : "No fictional records on this date.";
      return;
    }
    const b = e.target.closest("[data-action]");
    if (!b || b.disabled) return;
    const a = b.dataset.action;
    if (a === "select-alex") {
      if (state.role !== "Caregiver") return;
      state.selectedPatient = true;
      go("home");
      return;
    }
    if (a === "nav-more" || a === "nav-profile") {
      state.navigationCandidate = a === "nav-more" ? "more" : "profile";
      render();
      return;
    }
    if (a === "sample-normal") {
      toast("Component interaction example. No record changed.");
      return;
    }
    if (a === "sample-dialog") {
      $("#sampleDialog").showModal();
      return;
    }
    if (a === "close-dialog") {
      $("#sampleDialog").close();
      return;
    }
    dispatchAction(state, a, ui, b);
  }
  function change(e) {
    if (e.target.id !== "role") return;
    if (!["Patient", "Caregiver", "Clinician"].includes(e.target.value)) return;
    state.role = e.target.value;
    state.selectedPatient = false;
    go("home");
    render(true);
  }
  const router = createHashRouter(window, render);
  document.addEventListener("click", click);
  document.addEventListener("change", change);
  const timer = window.setInterval(() => {
    if ($("#timer"))
      $("#timer").textContent = formatElapsed(state.record, now());
  }, 1000);
  $(".header-right").insertAdjacentHTML(
    "afterbegin",
    `<a href="#plan" class="plan-shortcut">${ico("plan")}<span>Action plan</span></a>`,
  );
  render();
  return {
    state,
    render,
    go,
    dispatch: (a, b) => dispatchAction(state, a, ui, b),
    dispose() {
      document.removeEventListener("click", click);
      document.removeEventListener("change", change);
      router.dispose();
      window.clearInterval(timer);
      window.clearTimeout(toastTimer);
    },
  };
}
