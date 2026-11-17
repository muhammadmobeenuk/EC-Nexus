import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import { createSession, entriesOnDay } from "../src/domain/session.js";
import { transitionRecording, formatElapsed } from "../src/domain/recorder.js";
import { canPerformAction, routeBoundary } from "../src/domain/permissions.js";
import { mountApp } from "../src/app.js";
import { createScreens } from "../src/screens/index.js";
const fixed = () => Date.UTC(2026, 10, 17, 12, 0, 0);
const step = (s, action, route, time = fixed) => {
  s.current = route;
  return transitionRecording(s, action, { now: time });
};

test("unanswered check-in retains unknown clinical endpoints and attribution through save", () => {
  const s = createSession();
  assert.equal(s.record, null);
  assert.equal(step(s, "begin", "record"), "record");
  const original = structuredClone(s.record);
  assert.equal(step(s, "check", "record"), "check");
  assert.equal(step(s, "unanswered", "check"), "record");
  assert.equal(s.record.state, "active");
  assert.equal(s.record.start, original.start);
  assert.equal(
    step(s, "stop", "record", () => fixed() + 65000),
    "record",
  );
  assert.equal(formatElapsed(s.record, fixed() + 100000), "01:05");
  assert.equal(step(s, "save", "record"), "saved");
  const e = s.entries[0];
  assert.equal(e.activation, original.activation);
  assert.equal(e.source, "Patient reported");
  assert.equal(e.check, "Unanswered");
  assert.equal(e.onset, "Unknown");
  assert.equal(e.end, "Unknown");
  assert.match(e.history.join(" "), /01:05 — not seizure duration/);
  assert.equal("duration" in e, false);
  assert.equal("classification" in e, false);
  assert.equal(s.record, null);
  assert.equal(step(s, "save", "record"), false);
  assert.equal(s.entries.length, 4);
});
test("unfinished session remains unknown; elapsed time freezes without implying seizure completion", () => {
  const s = createSession();
  step(s, "begin", "record");
  step(s, "unfinished", "record", () => fixed() + 12000);
  assert.equal(s.record.state, "unfinished");
  assert.equal(s.record.check, true);
  assert.equal(formatElapsed(s.record, fixed() + 99000), "00:12");
  const stop = s.record.stop;
  assert.equal(step(s, "stop", "record"), false);
  assert.equal(s.record.stop, stop);
  step(s, "save", "record");
  assert.equal(s.entries[0].onset, "Unknown");
  assert.equal(s.entries[0].end, "Unknown");
  assert.match(s.entries[0].history[1], /unfinished/);
});
test("invalid and repeated recorder actions do not overwrite the recording", () => {
  const s = createSession();
  for (const a of ["stop", "unanswered", "unfinished", "save"])
    assert.equal(step(s, a, "record"), false);
  step(s, "begin", "record");
  const original = structuredClone(s.record);
  assert.equal(step(s, "begin", "record"), false);
  assert.deepEqual(s.record, original);
  assert.equal(step(s, "save", "record"), false);
  assert.equal(formatElapsed(s.record, fixed() - 1000), "00:00");
});
test("switching roles cannot mutate another recording or silently reattribute it", () => {
  const s = createSession();
  s.role = "Caregiver";
  s.selectedPatient = true;
  step(s, "begin", "record");
  const original = structuredClone(s.record);
  s.role = "Patient";
  s.selectedPatient = false;
  assert.equal(routeBoundary(s, "record"), "owner");
  for (const a of ["stop", "unfinished", "save", "begin"])
    assert.equal(step(s, a, "record"), false);
  assert.deepEqual(s.record, original);
  s.role = "Caregiver";
  s.selectedPatient = true;
  step(s, "stop", "record");
  step(s, "save", "record");
  assert.equal(s.entries[0].source, "Caregiver observed");
  assert.match(s.entries[0].history[0], /Caregiver/);
});
test("caregiver selection, revocation, and medication restrictions apply to routes and actions", () => {
  const s = createSession();
  s.role = "Caregiver";
  assert.equal(routeBoundary(s, "record"), "patient");
  assert.equal(step(s, "begin", "record"), false);
  s.selectedPatient = true;
  assert.equal(routeBoundary(s, "record"), null);
  assert.equal(step(s, "begin", "record"), "record");
  s.current = "medication";
  assert.equal(routeBoundary(s), "scope");
  assert.equal(canPerformAction(s, "dose0taken"), false);
  s.revoked = true;
  s.current = "record";
  assert.equal(canPerformAction(s, "stop"), false);
  assert.equal(routeBoundary(s, "diary"), "revoked");
  assert.equal(routeBoundary(s, "privacy"), null);
});
test("clinician is read-only for original mutations; simulated PDF and sharing remain available", () => {
  const s = createSession();
  s.role = "Clinician";
  for (const [route, action] of [
    ["record", "begin"],
    ["detail", "correct"],
    ["medication", "dose0taken"],
    ["device-review", "device-save"],
    ["privacy", "delete-confirm"],
  ]) {
    s.current = route;
    assert.equal(canPerformAction(s, action), false);
  }
  s.current = "report-preview";
  assert.equal(canPerformAction(s, "pdf"), true);
  s.current = "sharing";
  assert.equal(canPerformAction(s, "share"), true);
});
test("action context and missing record are guarded without changing demo policy", () => {
  const s = createSession();
  s.current = "home";
  assert.equal(canPerformAction(s, "dose0taken"), false);
  assert.equal(canPerformAction(s, "made-up"), false);
  s.current = "detail";
  s.selected = "missing";
  assert.equal(canPerformAction(s, "correct"), false);
});
test("calendar resolves stable identities after live, device and retrospective entries are prepended", () => {
  const s = createSession();
  const original = entriesOnDay(s, 16)[0];
  step(s, "begin", "record");
  step(s, "stop", "record");
  step(s, "save", "record");
  s.entries.unshift(
    { id: "device", calendarDate: "2026-11-17" },
    { id: "past", calendarDate: "2026-11-10" },
  );
  assert.equal(entriesOnDay(s, 16)[0].id, original.id);
  s.selected = original.id;
  const html = createScreens(s).routes.detail();
  assert.match(html, /16 Nov 2026/);
  assert.match(html, /Created by Alex/);
  assert.equal(entriesOnDay(s, 30).length, 0);
});
test("fresh session restores fictional seed and does not reuse modified objects", () => {
  const a = createSession();
  a.entries[0].history.push("changed");
  a.revoked = true;
  a.doses[0] = "Taken";
  a.selectedPatient = true;
  const b = createSession();
  assert.equal(b.entries.length, 3);
  assert.equal(b.entries[0].history.length, 1);
  assert.equal(b.revoked, false);
  assert.deepEqual(b.doses, ["Pending", "Pending"]);
  assert.equal(b.record, null);
  assert.equal(b.selectedPatient, false);
});

const shell = await readFile(new URL("../index.html", import.meta.url), "utf8");
function harness(t, hash = "home") {
  const dom = new JSDOM(shell, { url: `http://localhost/#${hash}` });
  dom.window.scrollTo = () => {};
  // Throw on any storage access: mounting and interacting must not touch legacy data.
  for (const name of ["localStorage", "sessionStorage"])
    Object.defineProperty(dom.window, name, {
      get() {
        throw new Error("Unexpected storage access");
      },
    });
  const state = createSession();
  const app = mountApp(dom.window.document, dom.window, { state, now: fixed });
  t.after(() => {
    app.dispose();
    dom.window.close();
  });
  return {
    ...app,
    dom,
    document: dom.window.document,
    route(route) {
      dom.window.history.replaceState(null, "", `#${route}`);
      app.render();
    },
    click(selector) {
      const el = dom.window.document.querySelector(selector);
      assert.ok(el, selector);
      el.click();
      if (state.current !== dom.window.location.hash.slice(1)) app.render();
    },
  };
}
test("all registered screens render without booting the archived app", (t) => {
  const h = harness(t);
  for (const route of Object.keys(createScreens(h.state).routes)) {
    h.route(route);
    assert.ok(h.document.querySelector("main h1"), route);
  }
});
test("DOM navigation never starts the recorder; confirm activation is cancellable", (t) => {
  const h = harness(t);
  h.route("record");
  assert.equal(h.state.record, null);
  h.document.querySelector("#method").value = "confirm";
  h.click('[data-action="begin"]');
  assert.equal(h.state.record, null);
  assert.match(h.document.querySelector("h1").textContent, /Ready to start/);
  h.route("record");
  assert.equal(h.state.record, null);
  h.document.querySelector("#method").value = "confirm";
  h.click('[data-action="begin"]');
  h.click('[data-action="start"]');
  assert.equal(h.state.record.state, "active");
  h.click('[data-action="check"]');
  h.click('[data-action="unanswered"]');
  assert.match(
    h.document.querySelector("main").textContent,
    /Seizure status remains unknown/,
  );
  h.click('[data-action="stop"]');
  h.click('[data-action="save"]');
  assert.equal(h.state.entries.length, 4);
  assert.match(h.document.querySelector("h1").textContent, /details can wait/);
});
test("DOM calendar opens original record after an entry is saved", (t) => {
  const h = harness(t);
  h.route("past");
  h.click('[data-action="past-save"]');
  h.route("calendar");
  h.click('[data-day="16"]');
  h.click("#dayResult [data-event]");
  assert.match(h.document.querySelector("h1").textContent, /16 Nov 2026/);
});
test("one role-change handler resets patient selection and preserves active recorder", (t) => {
  const h = harness(t);
  h.route("record");
  h.click('[data-action="begin"]');
  const original = structuredClone(h.state.record);
  const role = h.document.querySelector("#role");
  role.value = "Caregiver";
  role.dispatchEvent(new h.dom.window.Event("change", { bubbles: true }));
  assert.equal(h.state.selectedPatient, false);
  assert.match(
    h.document.querySelector("h1").textContent,
    /Who are you supporting/,
  );
  assert.deepEqual(h.state.record, original);
  h.click('[data-action="select-alex"]');
  assert.equal(h.state.selectedPatient, true);
  h.route("medication");
  assert.match(
    h.document.querySelector("h1").textContent,
    /Outside your shared scope/,
  );
  assert.equal(h.dispatch("dose0taken"), false);
  assert.equal(h.state.doses[0], "Pending");
});
test("corrections retain provenance; simulated deletion and PDF never delete data or produce files", (t) => {
  const h = harness(t);
  h.route("detail");
  h.click('[data-action="correct"]');
  assert.match(h.state.entries[0].history.at(-1), /Previous timing retained/);
  h.route("privacy");
  h.click('[data-action="delete"]');
  h.click('[data-action="delete-confirm"]');
  assert.equal(h.state.entries.length, 3);
  assert.match(h.state.privacyState, /no data deleted/);
  h.route("report-preview");
  h.click('[data-action="pdf"]');
  assert.match(
    h.document.querySelector("#toast").textContent,
    /No file generated/,
  );
});
test("skip link focuses main without changing route and controls retain accessible labels", (t) => {
  const h = harness(t, "record");
  h.click(".skip");
  assert.equal(h.document.activeElement.id, "main");
  assert.equal(h.dom.window.location.hash, "#record");
  assert.equal(
    h.document.querySelector("#role").getAttribute("aria-label"),
    "Explore as",
  );
  assert.match(
    h.document.querySelector("label.field").textContent,
    /Activation method/,
  );
  assert.equal(
    h.document.querySelector(".recordcircle").getAttribute("aria-label"),
    "Start demo recording",
  );
});

test("caregiver privacy controls cannot bypass the existing patient-only screen", () => {
  const s = createSession();
  s.role = "Caregiver";
  s.selectedPatient = true;
  s.current = "privacy";
  for (const action of [
    "revoke",
    "revoke-confirm",
    "export",
    "delete",
    "delete-confirm",
    "invite",
  ])
    assert.equal(canPerformAction(s, action), false);
});
test("revoked caregiver overview returns patient picker without exposing diary rows", (t) => {
  const h = harness(t);
  h.state.role = "Caregiver";
  h.state.selectedPatient = true;
  h.state.revoked = true;
  h.route("home");
  assert.match(
    h.document.querySelector("h1").textContent,
    /Who are you supporting/,
  );
  assert.equal(h.document.querySelector("[data-event]"), null);
});
test("caregiver save keeps caregiver source after switching away and back", () => {
  const s = createSession();
  s.role = "Caregiver";
  s.selectedPatient = true;
  step(s, "begin", "record");
  const activation = s.record.activation;
  s.role = "Patient";
  assert.equal(step(s, "stop", "record"), false);
  s.role = "Caregiver";
  s.selectedPatient = true;
  step(s, "stop", "record");
  step(s, "save", "record");
  assert.equal(s.entries[0].source, "Caregiver observed");
  assert.equal(s.entries[0].activation, activation);
});
test("device duplicate protection and retrospective dates remain session-only", (t) => {
  const h = harness(t);
  h.route("device-review");
  h.click('[data-action="device-save"]');
  assert.equal(h.state.entries.length, 4);
  h.route("device-review");
  h.click('[data-action="device-save"]');
  assert.equal(h.state.entries.length, 4);
  h.route("past");
  h.click('[data-action="past-save"]');
  assert.equal(entriesOnDay(h.state, 10).length, 1);
});
test("revocation blocks an active caregiver recorder without changing its original timing", () => {
  const s = createSession();
  s.role = "Caregiver";
  s.selectedPatient = true;
  step(s, "begin", "record");
  const original = structuredClone(s.record);
  s.revoked = true;
  for (const action of ["stop", "unfinished", "save"])
    assert.equal(step(s, action, "record"), false);
  assert.deepEqual(s.record, original);
});
test("simulated error and retry retain active recorder and original activation", (t) => {
  const h = harness(t);
  h.route("record");
  h.click('[data-action="begin"]');
  const original = structuredClone(h.state.record);
  h.route("scenarios");
  h.click('[data-action="error"]');
  h.click('[data-action="retry"]');
  assert.deepEqual(h.state.record, original);
  assert.match(
    h.document.querySelector("#scenario").textContent,
    /No external storage/,
  );
});
