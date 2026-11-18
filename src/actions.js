import { btn, note, link } from "./ui/components.js";
import { canPerformAction } from "./domain/permissions.js";
import { transitionRecording } from "./domain/recorder.js";
export function dispatchAction(
  state,
  a,
  { document, render, go, toast, now = Date.now },
  b,
) {
  const $ = (s) => document.querySelector(s);
  if (!canPerformAction(state, a)) {
    toast("This action is unavailable in the current demo context.");
    return false;
  }
  if (
    [
      "begin",
      "start",
      "stop",
      "check",
      "unanswered",
      "unfinished",
      "save",
    ].includes(a)
  ) {
    if (a === "begin" && $("#method")?.value === "confirm") {
      go("confirm");
      return true;
    }
    const result = transitionRecording(state, a, { now });
    if (!result) return false;
    go(result);
    return true;
  }
  if (a.startsWith("dose")) {
    state.doses[Number(a[4])] = a.endsWith("taken") ? "Taken" : "Missed";
    render();
    toast("Example medication entry updated.");
    return;
  }
  switch (a) {
    case "correct":
      let en = state.entries.find((e) => e.id === state.selected);
      en.history.push(
        `Previous timing retained: onset ${en.onset}, end ${en.end}. Applied fictional estimated timing 14:30–14:31.`,
      );
      en.onset = "14:30 (fictional estimate)";
      en.end = "14:31 (fictional estimate)";
      en.status = "Edited · estimate";
      render();
      break;
    case "accidental":
      state.entries.find((e) => e.id === state.selected).status =
        "Marked accidental";
      state.entries
        .find((e) => e.id === state.selected)
        .history.push("Marked accidental in demo. Original record retained.");
      render();
      break;
    case "recover":
      state.recovery = "Example check-in saved";
      render();
      toast("Optional demo response saved. No clinical assessment.");
      break;
    case "assist":
      toast("Assistance request preview only. Nobody has been contacted.");
      break;
    case "reminder":
      toast(
        "Reminder concept: review your diary later. Nothing has been scheduled.",
      );
      break;
    case "sideeffect":
      $("#sideeffectResult").textContent =
        "Saved example: " + $("#symptom").value;
      break;
    case "revoke":
      if (state.revoked) {
        state.revoked = false;
        render();
      } else {
        b.outerHTML =
          note(
            "Revoke Sam’s access in this demo? No real permission changes.",
          ) + btn("Confirm demo revocation", "revoke-confirm");
      }
      break;
    case "revoke-confirm":
      state.revoked = true;
      render();
      break;
    case "invite":
      toast(
        "Invitation preview only: example caregiver access. No invitation sent.",
      );
      break;
    case "export":
      state.privacyState = "Export request pending (simulation)";
      render();
      break;
    case "delete":
      b.outerHTML =
        note(
          "Preview a deletion request? Records will remain in this demo; no real deletion occurs.",
          true,
        ) + btn("Confirm simulated request", "delete-confirm");
      break;
    case "delete-confirm":
      state.privacyState =
        "Deletion request pending (simulation) · no data deleted";
      render();
      break;
    case "share":
      state.sharing =
        "Active for " +
        $("#expiry").value.replace(" (illustration)", "") +
        " (simulated; no live link)";
      render();
      break;
    case "unshare":
      state.sharing = "Revoked (simulation)";
      render();
      break;
    case "connect":
      state.device = "Connected (simulation only)";
      render();
      break;
    case "disconnect":
      state.device = "Disconnected";
      render();
      break;
    case "unsupported":
      state.device = "Unsupported example device";
      render();
      break;
    case "uncertain":
      state.deviceReview = "Unconfirmed · review deferred";
      render();
      break;
    case "dismiss-device":
      state.deviceReview = "Marked not an episode (demo)";
      render();
      break;
    case "device-save":
      if (state.deviceReview.includes("Added")) {
        toast("The suspected entry already exists in this session.");
        break;
      }
      state.entries.unshift({
        id: "device-example",
        calendarDate: "2026-11-17",
        date: "17 Nov 2026 · 10:24",
        source: "Device suspected · unconfirmed",
        status: "Needs review",
        onset: "Unknown",
        end: "Unknown",
        activation: "No manual activation",
        check: "Not applicable",
        history: [
          "Simulated device signal · 10:24",
          "Added for manual review; not clinically confirmed",
        ],
        notes: "Fictional possible event; detection did not occur.",
      });
      state.deviceReview = "Added for review · unconfirmed";
      go("diary");
      break;
    case "link-pair":
      toast(
        "Linked-pair preview: both source records retained; no automatic merge.",
      );
      break;
    case "pdf":
      toast(
        "PDF export simulated: a fictional report would be prepared. No file generated.",
      );
      break;
    case "offline":
      $("#scenario").innerHTML =
        "Offline demonstration: no cloud sync. An unfinished recorder remains available during this page session. Reloading clears demo changes. " +
        link("Return to recorder", "record");
      break;
    case "error":
      $("#scenario").innerHTML =
        "Example save error: draft retained in this session. " +
        btn("Retry simulated save", "retry");
      break;
    case "retry":
      $("#scenario").textContent =
        "Simulated retry complete. No external storage was contacted.";
      break;
    case "denied":
      $("#scenario").textContent =
        "Permission denied example. The requested diary is unavailable to this role.";
      break;
    case "empty":
      $("#scenario").innerHTML =
        "No events in this example view. " +
        link("Create a demo recording", "record");
      break;
    case "past-save":
      state.entries.unshift({
        id: crypto.randomUUID(),
        calendarDate: "2026-11-10",
        date: "10 Nov 2026 · time unknown",
        source: "Patient reported retrospectively",
        status: "Needs review",
        activation: "No live recorder activation",
        onset: "Unknown",
        end: "Unknown",
        check: "Not applicable",
        history: ["Fictional retrospective entry created"],
        notes: "Historical date is illustrative. Onset and end unknown.",
      });
      go("diary");
      break;
  }
  return true;
}
