# Implemented Data Schema

**Status:** Implemented

**Format:** Version-controlled local JSON validated against JSON Schema

**Authority:** The latest approved immutable snapshot powers the dashboard

## Core principles

1. Stable IDs, explicit provenance, and status history are mandatory.
2. Reports and approved snapshots are immutable.
3. Import proposals are separate from approved data.
4. Updates merge only by stable ID and explicit reviewer action.
5. Omission from a newer report has no semantic meaning.
6. Unknown values remain `null` or “Not provided”; they are never guessed.

## Storage

```text
content/
  reports/                 # Original Markdown reports supplied manually
public/
  reports/                 # Public-safe reports copied into the static build
src/data/
  current.json             # Latest approved snapshot powering the dashboard
data/
  snapshots/YYYY-MM-DD_<snapshot-id>.json
staging/
  imports/<proposal-id>.json
  reviews/<proposal-id>.md
schemas/
  dashboard.schema.json
  import-proposal.schema.json
```

`current.json` is replaced only by the explicit apply command. It is never written by the import command.

## Identity and enumerations

### Stable IDs

Human-readable, immutable IDs use a type prefix and sortable date/sequence, for example:

- `report-2026-07-001`
- `acc-2026-07-001`
- `milestone-2026-07-001`
- `risk-2026-07-001`

Changing a title does not change an ID. A materially different item receives a new ID and may reference the prior item with `supersedesId`.

### Workstream IDs

```text
staff-and-faculty-development
student-ai-literacy
governance
infrastructure
research
communications
```

### Source basis

The report author or reviewer must supply one of:

```text
project-file-only
live-checked
specific-documents-reviewed
user-reported
```

Optional qualifiers can state `not-independently-verified`. The dashboard itself never performs a live check.

### Status vocabularies

Use type-specific controlled values; do not collapse all meanings into one generic status.

- Milestones: `completed`, `active`, `scheduled`, `waiting`, `needs-verification`, `proposed`, `closed`, `superseded`.
- Risks: `open`, `monitoring`, `mitigated`, `realized`, `closed`, `superseded`.
- Decisions: `requested`, `under-review`, `approved`, `declined`, `withdrawn`, `closed`, `superseded`.
- Workstreams: `active`, `scheduled`, `waiting`, `needs-verification`, `proposed`, `closed`.
- Accomplishments: `completed`, `needs-verification`, `withdrawn`, `superseded`. “Completed” describes the recorded work only; it does not imply operational readiness.

### Severity

`critical`, `high`, `medium`, `low`.

## Common record envelope

Every substantive item includes:

```ts
type RecordEnvelope = {
  id: string
  title: string
  description: string
  workstreamId: WorkstreamId | null
  status: string
  owner: string | null
  relevantDate: string | null       // ISO date only when supplied
  timeHorizon: string | null         // Used when precision is not supplied
  lastUpdatedDate: string            // ISO date of approved record change
  sourceReportId: string
  sourceStatus: SourceBasis
  sourceQualifier: "not-independently-verified" | null
  statusHistory: StatusHistoryEntry[]
  supersedesId: string | null
}
```

`relevantDate` and `timeHorizon` may not both be invented to increase precision. Use the form actually supported by the report.

## Top-level approved snapshot

```ts
type DashboardSnapshot = {
  schemaVersion: string
  snapshotId: string
  approvedAt: string
  approvedBy: string
  proposalId: string
  previousSnapshotId: string | null
  metadata: DashboardMetadata
  reportingPeriods: ReportingPeriod[]
  reports: Report[]
  accomplishments: Accomplishment[]
  workstreams: Workstream[]
  priorities: Priority[]
  milestones: Milestone[]
  risks: Risk[]
  dependencies: Dependency[]
  decisions: DecisionRequest[]
}
```

Referential validation requires every `sourceReportId`, `workstreamId`, `previousSnapshotId`, and relationship ID to resolve.

## Entity definitions

### Dashboard metadata

```ts
type DashboardMetadata = {
  title: "AI@UNCW Project Dashboard"
  executiveSummary: string
  lastUpdatedDate: string
  reportingPeriodId: string
  sourceBasis: SourceBasis
  sourceQualifier: "not-independently-verified" | null
  primaryAttentionItem: { type: "risk" | "decision" | "milestone"; id: string } | null
}
```

### Reporting period

```ts
type ReportingPeriod = {
  id: string
  label: string
  startDate: string | null
  endDate: string | null
}
```

### Report

```ts
type Report = {
  id: string
  reportingPeriodId: string
  reportDate: string
  executiveSummary: string
  sourceBasis: SourceBasis
  sourceQualifier: "not-independently-verified" | null
  localMarkdownPath: string
  incorporatedSnapshotId: string
  changeSummary: ChangeReference[]
  contentHash: string
}
```

Only repository-relative, dashboard-local report paths are permitted. Internal paths are never rendered.

### Accomplishment

Extends `RecordEnvelope` with:

```ts
{
  completionDate: string | null
  reportingPeriodId: string
  institutionalValue: string
  evidence: { label: string; localPath: string }[]
}
```

Evidence must be safe, local, optional, and separately reviewed.

### Workstream

```ts
type Workstream = RecordEnvelope & {
  id: WorkstreamId
  recentAccomplishmentIds: string[]
  currentFocus: string
  nextMilestoneId: string | null
  dependencyIds: string[]
  targetTiming: string | null
  lastReportWithUpdateId: string
}
```

### Priority

Extends `RecordEnvelope` with `rank: 1 | 2 | 3 | 4 | 5` and an optional relationship to a milestone, risk, or decision. Ranking is editorial and must be approved.

### Milestone

Extends `RecordEnvelope` with:

```ts
{
  roadmapBand: "now" | "next" | "later"
  targetDate: string | null
  dependencyIds: string[]
}
```

### Risk

Extends `RecordEnvelope` with:

```ts
{
  severity: "critical" | "high" | "medium" | "low"
  riskStatement: string
  mitigation: string
  escalationTrigger: string
  supervisorAttentionNeeded: boolean
}
```

### Dependency

Extends `RecordEnvelope` with `affectedItemIds`, `dependencyType`, and `resolutionCondition`. A blocker is a dependency whose current state prevents progress; it is not inferred merely from delay.

### Decision or support request

Extends `RecordEnvelope` with:

```ts
{
  requestType: "decision" | "support"
  request: string
  whyItMatters: string
  decisionOwner: string | null
  requestedTiming: string | null
  consequenceOfDelay: string
  informationalOnly: boolean
}
```

`informationalOnly: true` items appear under “For awareness,” never under action requested.

### Status history

```ts
type StatusHistoryEntry = {
  status: string
  effectiveDate: string
  recordedAt: string
  sourceReportId: string
  proposalId: string
  note: string
}
```

History is append-only. Corrections create a new entry that explains the correction.

## Import proposal schema

The staging proposal contains no executable instructions and cannot become current data by being copied into `content/reports/`.

```ts
type ImportProposal = {
  schemaVersion: string
  proposalId: string
  createdAt: string
  sourceReport: {
    path: string
    contentHash: string
    proposedReportId: string
  }
  baseSnapshotId: string
  state: "needs-review" | "approved" | "rejected" | "applied"
  additions: ProposedChange[]
  updates: ProposedChange[]
  proposedStatusChanges: ProposedStatusChange[]
  newRisksOrBlockers: ProposedChange[]
  newMilestones: ProposedChange[]
  newDecisionRequests: ProposedChange[]
  ambiguities: Ambiguity[]
  sensitiveContentFindings: SensitiveContentFinding[]
  reviewerAttestation: ReviewerAttestation | null
}
```

Every update stores before/after values and a source excerpt location. The importer may suggest; it may not silently decide.

## Apply-time invariants

- The proposal source hash still matches the original report.
- The base snapshot is still current; otherwise the proposal must be regenerated or reconciled.
- All ambiguities are resolved or explicitly excluded.
- All sensitive-content findings are resolved.
- Reviewer approval is present and names the proposal ID.
- No stable ID collision or unresolved reference exists.
- No existing report, accomplishment, history entry, or snapshot is removed.
- No omitted record changes status.
- A new immutable snapshot is written before `current.json` is updated.
- Validation must pass before any file replaces `current.json`.
