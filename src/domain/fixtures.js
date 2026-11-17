const seedEntries = [
  {
    date: "16 Nov 2026 · 14:32",
    source: "Patient reported",
    status: "Needs review",
    onset: "Unknown",
    end: "Unknown",
    activation: "16 Nov 2026, 14:32",
    check: "Unanswered",
    history: ["Created by Alex · 16 Nov, 14:32"],
    notes: "Information left incomplete; review later.",
  },
  {
    date: "12 Nov 2026 · 09:15",
    source: "Caregiver observed",
    status: "Reviewed",
    onset: "09:10 (estimated)",
    end: "09:12 (estimated)",
    activation: "12 Nov 2026, 09:15",
    check: "Not shown",
    history: ["Created by Sam · 12 Nov, 09:15"],
    notes: "Fictional observation; timing is an estimate.",
  },
  {
    date: "6 Nov 2026 · 18:40",
    source: "Patient reported",
    status: "Reviewed",
    onset: "Unknown",
    end: "Unknown",
    activation: "6 Nov 2026, 18:40",
    check: "Not shown",
    history: ["Created by Alex · 6 Nov, 18:40"],
    notes: "No additional information recorded.",
  },
];
export function createEntries() {
  return structuredClone(seedEntries).map((e, i) => ({
    ...e,
    id: `seed-${i}`,
    calendarDate: ["2026-11-16", "2026-11-12", "2026-11-06"][i],
  }));
}
