# Manual Update Workflow

**Status:** Implemented

**Core rule:** Preparing an update and applying an approved update are separate actions.

## What this protects

The workflow prevents a newly added report, an ambiguous phrase, or an importer suggestion from changing the supervisor dashboard without Julian's explicit review and approval.

Nothing watches the reports folder. Nothing runs on a schedule. Nothing connects to email, calendars, Teams, SharePoint, ChatGPT, Codex tasks, another repository, or the internet. A user may manually send one reviewed report from the private AI Hub Operations dashboard into `content/reports/`; that explicit action creates the same `needs-review` proposal described below and does not approve, apply, commit, deploy, or publish anything.

## Before adding a report

Remove or redact information that should not appear in this dashboard, including private student information, health information, restricted sponsor information, identifiable human-subjects data, credentials, or sensitive personnel details.

Use Markdown headings that make the report easier to review:

```text
# Progress Report
Reporting period:
Report date:
Source basis:

## Executive summary
## Accomplishments
## Current priorities
## Workstream updates
## Milestones
## Risks, blockers, and dependencies
## Decisions or support needed
## Items needing verification
```

The parser should tolerate missing sections, but missing content never means completed, canceled, or superseded.

## Stage 1: Prepare a proposed update

1. Place the original Markdown report in `content/reports/`.
2. Run:

   ```bash
   npm run import-report -- content/reports/<report-name>.md
   ```

3. The command validates the report's metadata, records a content hash, scans for likely sensitive content, and writes a proposal under `staging/imports/`.
4. It does **not** change `src/data/current.json`, an approved snapshot, or the dashboard.
5. Open the human-readable review:

   ```bash
   npm run review-import -- <proposal-id>
   ```

The review must show:

- New accomplishments.
- Updates to existing active items, with before/after values.
- Proposed status changes, each explicit.
- New risks, blockers, dependencies, and milestones.
- New decisions or support requests.
- Ambiguities and items needing verification.
- Potentially sensitive content.
- Records in the current snapshot that the report did not mention. These are labeled “No change proposed.”

## Human review and approval

Julian reviews every proposed change. For each ambiguity, he must choose one of three outcomes:

- Clarify and include.
- Exclude from this update.
- Keep in staging for later review.

The proposal cannot be approved while unresolved sensitive-content findings remain. Approval creates a local reviewer attestation tied to the proposal ID, source hash, and base snapshot ID. Approval does not itself update the dashboard.

Proposed command:

```bash
npm run approve-import -- <proposal-id>
```

## Stage 2: Apply the approved update

Apply only the exact approved proposal:

```bash
npm run apply-import -- <proposal-id>
```

The apply command must stop if the source report changed, the current snapshot changed, an ambiguity remains, a sensitive-content finding remains, or validation fails.

On success it:

1. Preserves the original report.
2. Creates a new immutable dated snapshot.
3. Appends history entries rather than rewriting history.
4. Updates `current.json` from that validated snapshot.
5. Marks the proposal as applied.
6. Produces a plain-language record of dashboard changes.

It never treats omission as a status change.

## Validate and preview

After applying:

```bash
npm run validate
npm test
npm run build
npm run preview
```

Review the local preview on desktop and mobile, including keyboard navigation, print layout, source links, filters, deep links, and the AI@UNCW email link.

Before considering the update complete, confirm:

- The first screen can be understood in two minutes.
- Every substantive statement links to a source report.
- Source status and “As of” date are visible.
- Earlier accomplishments, reports, histories, and snapshots remain available.
- Omitted items did not change status.
- Requests are separated from informational updates.
- No sensitive or internal path information is displayed.
- Only the explicitly approved public-safe changes are present in `src/data/current.json` and `public/reports/`.

## Reject, revise, or recover

- **Reject:** Mark the proposal rejected; approved data is untouched.
- **Revise the report:** Save the revision as a new file or explicit revision, rerun import, and review a new proposal. Revised does not mean approved.
- **Stale proposal:** If another proposal was applied first, regenerate against the latest snapshot.
- **Apply failure:** Keep the prior `current.json` untouched. Diagnose, correct the proposal or tooling, and rerun validation before another apply attempt.
- **Bad approved update:** Do not erase it. Create a corrective report and new proposal so the audit trail remains intact.

## Publication

The initial public GitHub Pages deployment was authorized on July 17, 2026. After an approved update is committed to `main`, GitHub Actions validates, tests, builds, and publishes that approved repository state. The deployment workflow does not import reports or change dashboard data. No analytics, cookies, third-party embeds, or tracking are permitted.
