# Implemented Information Architecture

**Status:** Implemented for the public dashboard

**Date:** 2026-07-17

**Audience:** Public visitors and university leadership

## Design principle

The first view answers four questions in under two minutes: What has been accomplished? What is happening now? What needs attention? How trustworthy and current is the information?

The dashboard is a supervisory record, not a project-management system. Operational detail stays out unless it changes institutional value, timing, risk, or a decision requested from senior leadership.

## Application shell

- **Quiet header:** Text-only identity, “AI Hub / GAABS,” with no invented logo or official seal.
- **Primary navigation:** Overview, Accomplishments, Workstreams, Roadmap, Risks, Decisions, Reports.
- **Persistent context:** Every current-state page displays “As of,” reporting period, and source basis.
- **Help:** A compact “About this record” panel explains source labels and the manual approval boundary.
- **Footer:** “Questions or comments? Contact [AI@UNCW](mailto:ai@uncw.edu).”
- **Responsive navigation:** Horizontal navigation on desktop; labeled menu drawer on mobile.

## 1. Overview

### Purpose

Give a senior leader a reliable status read in two minutes without card clutter.

### Layout

1. Executive summary and update metadata.
2. Open priority list with three to five items.
3. One emphasized attention rail for the most important blocker, risk, or decision.
4. Short identity statement: “The AI Hub Orchestrates and GAABS Supports AI Builders.”
5. Recent approved accomplishments as a compact list, when available.

The attention rail shows one issue only. If no approved issue requires attention, it says so plainly.

## 2. Accomplishments

### Purpose

Preserve recent and cumulative institutional value without allowing newer reports to erase completed work.

### Layout and controls

- Recent-period / Cumulative view switch.
- Search plus workstream, date range, and reporting-period filters.
- Open, table-like records rather than a grid of cards.
- Expandable detail reveals description, institutional value, provenance, source status, and safe local evidence.
- Direct link to each accomplishment via its stable ID.

The cumulative view is the durable record. Filters never mutate data.

## 3. Workstreams

### Purpose

Show the condition and near-term direction of the six authorized workstreams.

### Structure

The page begins with a compact six-row index:

1. Staff and Faculty Development
2. Student AI Literacy
3. Governance
4. Infrastructure
5. Research
6. Communications

Selecting a row opens a workstream detail view with qualitative status, recent accomplishments, current focus, next milestone, dependencies, target timing, and the last report containing an update. No percentage is displayed unless an approved report supplies a valid quantitative measure.

## 4. Roadmap

### Purpose

Clarify sequencing and dependencies without implying precision the reports do not support.

### Layout

- Now / Next / Later bands on desktop; stacked bands on mobile.
- Milestones appear as structured rows with outcome, workstream, owner, timing, status, dependency, source, and last update.
- Status is shown by text, shape, and restrained color.
- Completed and closed/superseded records remain available through a history control.
- Missing items remain unchanged until an approved proposal explicitly updates them.

## 5. Blockers, Risks, and Dependencies

### Purpose

Show only issues material to supervision, institutional outcomes, timing, or authority.

### Layout

- Default sort: supervisor attention first, then severity, then recency.
- Severity labels: Critical, High, Medium, Low.
- Each issue states the risk in plain language, mitigation, owner, escalation trigger, supervisor-attention requirement, source report, and last update.
- Severity never relies on color alone.
- Resolved risks remain in history but leave the active default view.

## 6. Decisions and Support Needed

### Purpose

Separate actual requests from informational updates.

### Layout

- **Action requested:** Open requests ordered by requested timing.
- **For awareness:** Informational updates, visually subordinate and never phrased as requests.
- **Decision history:** Resolved, declined, withdrawn, or superseded requests with provenance.

Every request shows why it matters, decision owner, requested timing, consequence of delay, status, and source report.

## 7. Progress Report Archive

### Purpose

Provide the immutable evidence trail behind the dashboard.

### Layout

- Reverse-chronological report list with reporting period, report date, executive summary, and source basis.
- Each report opens a dashboard-local full report view.
- A “Dashboard changes” section shows exactly what was incorporated.
- Approved snapshot links let an authorized reviewer reconstruct the dashboard as it appeared after that report.
- New reports never rewrite old reports or snapshots.

## Deep links and findability

Routes should support stable direct links:

- `/accomplishments/:id`
- `/workstreams/:id`
- `/roadmap/:id`
- `/risks/:id`
- `/decisions/:id`
- `/reports/:id`

Search is limited to approved dashboard content. It does not scan the filesystem or another repository.

## Print behavior

- Overview and individual reports have dedicated print layouts.
- Navigation, filters, and interactive controls are removed in print.
- The title, “As of” date, reporting period, source basis, page URL, and print date remain visible.
- Status colors retain text labels and high-contrast borders in grayscale.

## Mobile behavior

- Preserve the same section order and source context.
- Convert wide tables into labeled record stacks, not horizontally scrolling miniature tables.
- Keep the attention rail near the top.
- Use 44px minimum interactive targets and a persistent visible focus style.
- Filters open in a full-width panel and summarize active selections after closing.

## Content-state behavior

- **No approved data:** Honest empty state; never substitute demo facts in production.
- **Needs review:** Exists only in the local staging/review artifact, not the supervisor dashboard.
- **Stale current view:** A visible warning appears when the approved snapshot's review date has passed a configured threshold; it does not claim the content itself is wrong.
- **Sensitive-content warning:** Blocks proposal application until the reviewer resolves or explicitly documents each finding.
