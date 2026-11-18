import { canPerformAction } from "./permissions.js";
/** Recorder activity is not a measurement of seizure activity. */
export function formatElapsed(record, now = Date.now()) {
  if (!record) return "00:00";
  const seconds = Math.max(
    0,
    Math.floor(((record.stop ?? now) - record.start) / 1000),
  );
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
export function transitionRecording(state, action, { now = Date.now } = {}) {
  if (!canPerformAction(state, action)) return false;
  const r = state.record;
  if (action === "begin" || action === "start") {
    if (r) return false;
    const time = now();
    state.record = {
      ownerRole: state.role,
      patientId: "alex-demo",
      start: time,
      activation: new Date(time).toLocaleString("en-GB"),
      calendarDate: new Date(time).toLocaleDateString("en-CA"),
      state: "active",
      check: false,
    };
    return "record";
  }
  if (!r || r.ownerRole !== state.role) return false;
  switch (action) {
    case "check":
      return r.state === "active" ? "check" : false;
    case "unanswered":
      if (r.state !== "active") return false;
      r.check = true;
      return "record";
    case "stop":
    case "unfinished":
      if (r.state !== "active") return false;
      r.state = action === "stop" ? "stopped" : "unfinished";
      r.stop = now();
      if (action === "unfinished") r.check = true;
      return "record";
    case "save":
      if (!["stopped", "unfinished"].includes(r.state)) return false;
      state.entries.unshift({
        id: crypto.randomUUID(),
        calendarDate: r.calendarDate,
        date: r.activation,
        activation: r.activation,
        source:
          r.ownerRole === "Caregiver"
            ? "Caregiver observed"
            : "Patient reported",
        status: "Needs review",
        onset: "Unknown",
        end: "Unknown",
        check: r.check ? "Unanswered" : "Not shown",
        history: [
          `Created by ${r.ownerRole} · activation ${r.activation}`,
          `Recorder ${r.state}; elapsed ${formatElapsed(r)} — not seizure duration`,
        ],
        notes: "Fictional recording interaction. Clinical status unknown.",
      });
      state.record = null;
      return "saved";
    default:
      return false;
  }
}
