import { createEntries } from "./fixtures.js";
/** A fresh fictional session. Never reads or writes browser storage. */
export function createSession() {
  return {
    role: "Patient",
    current: "home",
    record: null,
    selected: "seed-0",
    revoked: false,
    entries: createEntries(),
    doses: ["Pending", "Pending"],
    sharing: "Not created",
    privacyState: "No request",
    device: "Disconnected",
    deviceReview: "Unconfirmed",
    recovery: "Not completed",
    selectedPatient: false,
    navigationCandidate: "more",
  };
}
export function entriesOnDay(state, day) {
  return state.entries.filter(
    (e) => e.calendarDate === `2026-11-${String(day).padStart(2, "0")}`,
  );
}
