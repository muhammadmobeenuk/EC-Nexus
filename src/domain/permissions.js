// Existing v0.2 demo rules, consolidated from app.js and refinement.js.
// This is presentation/session behavior, not authentication or clinical policy.
const publicRoutes = new Set([
  "home",
  "patients",
  "privacy",
  "more",
  "design",
  "evidence",
  "screen-map",
  "contrast",
  "settings",
  "guide",
  "welcome",
]);
const caregiverDenied = new Set(["medication", "sharing"]);
const clinicianDenied = new Set([
  "privacy",
  "profile",
  "medication",
  "recovery",
  "device-review",
  "past",
]);
export function routeBoundary(state, route = state.current) {
  if (state.role === "Caregiver") {
    if (!publicRoutes.has(route) && state.revoked) return "revoked";
    if (!publicRoutes.has(route) && !state.selectedPatient) return "patient";
    if (caregiverDenied.has(route)) return "scope";
  }
  if (state.role === "Clinician" && clinicianDenied.has(route))
    return "clinician";
  if (
    state.record &&
    state.record.ownerRole !== state.role &&
    ["record", "check", "confirm"].includes(route)
  )
    return "owner";
  return null;
}
// Action destinations follow the screens that exposed these controls in v0.2.
const actionRoutes = {
  begin: ["record"],
  start: ["confirm"],
  stop: ["record", "check"],
  check: ["record"],
  unanswered: ["check"],
  unfinished: ["record"],
  save: ["record"],
  correct: ["detail"],
  accidental: ["detail"],
  recover: ["recovery"],
  assist: ["recovery"],
  reminder: ["recovery"],
  sideeffect: ["medication"],
  revoke: ["privacy"],
  "revoke-confirm": ["privacy"],
  invite: ["privacy"],
  export: ["privacy"],
  delete: ["privacy"],
  "delete-confirm": ["privacy"],
  share: ["sharing"],
  unshare: ["sharing"],
  connect: ["wearable"],
  disconnect: ["wearable"],
  unsupported: ["wearable"],
  uncertain: ["device-review"],
  "dismiss-device": ["device-review"],
  "device-save": ["device-review"],
  "link-pair": ["duplicate"],
  pdf: ["report-preview"],
  offline: ["scenarios"],
  error: ["scenarios"],
  retry: ["scenarios"],
  denied: ["scenarios"],
  empty: ["scenarios"],
  "past-save": ["past"],
};
export function canPerformAction(state, action) {
  const routes = /^dose[01](taken|missed)$/.test(action)
    ? ["medication"]
    : actionRoutes[action];
  if (!routes || !routes.includes(state.current) || routeBoundary(state))
    return false;
  if (
    state.role === "Clinician" &&
    !["pdf", "share", "unshare"].includes(action)
  )
    return false;
  // The caregiver-specific privacy screen exposed no account-control actions.
  if (state.role === "Caregiver" && state.current === "privacy") return false;
  if (
    ["correct", "accidental"].includes(action) &&
    !state.entries.some((e) => e.id === state.selected)
  )
    return false;
  return true;
}
