# AI@UNCW Project Dashboard

A standalone, public-facing progress dashboard for The AI Hub and GAABS at UNC Wilmington.

**Live site:** [https://drjkeith.github.io/ai-uncw-project-dashboard/](https://drjkeith.github.io/ai-uncw-project-dashboard/)

## Public and technical boundaries

- The dashboard is independent. It does not read, link to, watch, or synchronize with the GAABS Chief of Staff repository. A user may explicitly send one reviewed public report from the private dashboard into this repository's review queue; nothing is transferred automatically.
- Content changes only after Julian manually supplies a progress report, reviews the proposed public changes, and explicitly approves application.
- A push to `main` automatically validates, builds, and deploys the already-approved repository state.
- No API, database, authentication provider, analytics, cookies, trackers, scheduled jobs, webhooks, file watchers, or external data source is used.
- Internal deliberations, confidential stakeholder notes, private personnel information, and unapproved claims must never be added to this public repository.

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run validate
npm test
npm run dev
```

Production check:

```bash
npm run build
npm run preview
```

The built site is written to `dist/`.

## Manual progress-report update

When a reviewed public draft is prepared in AI Hub Operations, use its **Approve & apply public update** action. It transfers the exact reviewed report into this repository, records the approval, creates the snapshot, and runs the local checks without downloading a file or using the command line. The live GitHub Pages deployment remains a separate authorized deployment step.

Importing and applying are separate explicit actions. Nothing runs automatically when a report is added.

1. Create a public-safe Markdown report in `content/reports/` using these metadata lines:

   ```text
   Reporting period: <period>
   Report date: YYYY-MM-DD
   Source basis: Project-file-only
   ```

2. Create a proposal. This does not modify approved data:

   ```bash
   npm run import-report -- content/reports/<report>.md
   npm run review-import -- <proposal-id>
   ```

3. Review any public-safety alert. The review names the exact line, matched phrase, and recommended next step, so you do not need to search the document. Prepare the complete reviewed snapshot as `staging/imports/<proposal-id>.approved-data.json`.
4. Julian explicitly approves, then applies, that exact reviewed snapshot:

   ```bash
   npm run approve-import -- <proposal-id>
   npm run apply-import -- <proposal-id>
   ```

5. Validate and inspect before committing:

   ```bash
   npm run validate
   npm test
   npm run build
   npm run preview
   ```

6. Push the approved commit to `main`. The Pages workflow rebuilds and deploys it.

The import command never infers that an omitted item was completed, canceled, or superseded. Approved snapshots are preserved under `data/snapshots/` when later reports are applied.

## GitHub Pages deployment

The workflow at `.github/workflows/deploy-pages.yml` runs on every push to `main` and can also be started manually from the Actions tab. It validates public data, runs tests, builds with Vite, uploads `dist/`, and deploys through the protected `github-pages` environment.

Repository setup:

1. The repository must be public.
2. Open **Settings → Pages** and choose **GitHub Actions** under **Build and deployment**. This is a one-time repository setting.
3. Push an approved commit to `main` or run the workflow manually.

## Optional custom domain

No custom domain is configured. To add one later:

1. Configure the domain under **Settings → Pages** and follow GitHub’s DNS instructions.
2. Add an Actions repository variable named `PAGES_CUSTOM_DOMAIN` with value `true`. This changes Vite’s production base path from the repository subpath to `/`.
3. Re-run the Pages workflow and verify HTTPS enforcement after DNS propagation.

Do not add a `CNAME` or change DNS until the custom domain is explicitly approved.

## Troubleshooting

- **404 at the live URL:** Confirm Pages uses GitHub Actions, then open **Actions → Validate and deploy GitHub Pages** and inspect the latest run.
- **Blank page or missing assets:** Confirm `PAGES_CUSTOM_DOMAIN` is unset for the normal `github.io/<repository>/` URL. Set it only for an active custom domain.
- **Workflow cannot deploy:** Confirm the workflow has `pages: write` and `id-token: write`, and that the `github-pages` environment permits `main`.
- **Build fails on data validation:** Run `npm run validate` locally. Fix missing stable IDs, broken report references, or public-data safety findings before pushing.
- **An update appears wrong:** Do not rewrite history. Create a corrective report and a new proposal, then apply a new approved snapshot.
- **Stale site after a successful deployment:** Hard-refresh once, then verify the deployment URL shown in the workflow’s `deploy` job.

## Design and governance documentation

- [Information architecture](docs/PROPOSED_INFORMATION_ARCHITECTURE.md)
- [Data schema](docs/DATA_SCHEMA.md)
- [Manual update workflow](docs/UPDATE_WORKFLOW.md)
- [Visual concept and design system](docs/VISUAL_CONCEPT.md)

The AI Hub Orchestrates and GAABS Supports AI Builders.
