const icons = {
  home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  diary:
    '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  record: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
  medication:
    '<path d="m8 4-4 4a5 5 0 0 0 7 7l4-4a5 5 0 0 0-7-7ZM7 5l7 7"/><path d="M16 15h5v6h-5z"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  plan: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="M8 12h8M12 8v8"/>',
  reports: '<path d="M4 3v18h17M8 16v-4M13 16V7M18 16v-7"/>',
  privacy:
    '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  wearable:
    '<rect x="6" y="6" width="12" height="12" rx="4"/><path d="M9 2h6v4M9 18v4h6v-4m-6-6 2 2 4-4"/>',
};
export const ico = (n) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[n] || icons.more}</svg>`;
export const btn = (label, action, primary = false) =>
  `<button class="btn ${primary ? "primary" : ""}" data-action="${action}">${label}</button>`;
export const link = (label, to, primary = false) =>
  `<a class="btn ${primary ? "primary" : ""}" href="#${to}">${label}</a>`;
export const pill = (s, a = false) =>
  `<span class="pill ${a ? "amber" : ""}">${s}</span>`;
export const note = (s, a = false) =>
  `<div class="notice ${a ? "amber" : ""}">${s}</div>`;
export const heading = (eyebrow, title, sub = "", side = "") =>
  `<div class="heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="sub">${sub}</p></div>${side}</div>`;
export const chart = () =>
  `<div class="chart" role="img" aria-label="Illustrative recorded event counts: August 4, September 2, October 5, November 3. Incomplete months cannot be compared directly.">${[4, 2, 5, 3].map((v, i) => `<div class="barcol"><span>${v}</span><div class="bar" style="height:${v * 19}px"></div><span>${["AUG", "SEP", "OCT", "NOV*"][i]}</span></div>`).join("")}</div><p class="chart-note">Fixed illustration · *November is incomplete. Counts are records, not clinically confirmed seizures.</p>`;
