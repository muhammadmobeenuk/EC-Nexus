# Epilepsy Care Nexus

A responsive, browser-local prototype for everyday epilepsy care tracking.

## Run locally

Requires Node.js 20 or newer. There are no third-party runtime dependencies.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Set `PORT` to use another port.

```sh
npm run build
```

Creates a static `dist/` folder suitable for static hosting.

## Included

- Overview with journal count, daily routine, and wellbeing check-in
- Seizure journal with date, type, duration, notes, and deletion
- Two clearly labeled sample medication reminders with daily completion tracking
- Care contacts and journal export as JSON
- Responsive layouts, keyboard-accessible forms, and local persistence

## Data and scope

Entries are saved in this browser's localStorage. No data is sent to a backend. Clearing site data removes records; export a journal to keep a copy. This prototype has no authentication, encryption, clinician integration, notifications, or synchronization. Use sample information on shared devices. Medication reminders are illustrative and cannot substitute for a prescribed schedule.

This is a personal tracking prototype, not medical advice or an emergency service. Follow your care plan and contact local emergency services for urgent help.

## Project structure

- `index.html`: application shell
- `src/app.js`: views, forms, persistence, and export
- `src/styles.css`: responsive styles
- `server.js`: local development server
- `build.js`: static build

## Preserved vision prototype v0.2

The parallel vision prototype is preserved in `prototypes/vision-v02/`, including its patient, caregiver, clinician, and design-system previews. See [its documentation](docs/vision-v02.md).

Run it separately with:

```sh
python -m http.server 8080 --directory prototypes/vision-v02
```

The Nexus app remains the default Node development app and static build. The two prototypes are independent.
