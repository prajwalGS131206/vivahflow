# VivahFlow

A clean React + Vite + TypeScript starter for an Indian wedding guest-management product.

## Current demo features

- Dashboard overview with illustrative invitation, RSVP, arrival, and catering metrics
- Guest list search and RSVP filtering
- Add household demo flow
- Manual arrival check-in and undo
- Events overview
- Food budget estimate based on configurable demo assumptions
- Responsive layout for desktop and mobile

## Important

This version uses in-memory sample data. Guest edits reset when the page refreshes. There is no real authentication, database, messaging, QR scanning, or payment integration yet. Figures are illustrative, not actual savings or attendance predictions.

## Run locally

Install Node.js LTS, then from this folder:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually http://localhost:5173).

To check the production build:

```bash
npm run build
```

## GitHub

Create an empty repository named `vivahflow` on GitHub (do not add a README or .gitignore there if you already have them here). Then:

```bash
git init
git add .
git commit -m "chore: create VivahFlow starter"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/vivahflow.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. `.gitignore` excludes `node_modules`, build output, and environment files.

## Planned next milestones

1. Persist guest records in a database.
2. Add authentication and per-wedding access control.
3. Add unique RSVP links and event-specific attendance.
4. Add QR check-in with duplicate-scan protection.
5. Add configurable catering minimums and forecast ranges.
6. Add real messaging integrations only after consent, cost, and compliance review.
