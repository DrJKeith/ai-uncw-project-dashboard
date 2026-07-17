export type Status =
  | 'Completed'
  | 'Active'
  | 'Scheduled'
  | 'Waiting'
  | 'Needs verification'
  | 'Proposed'
  | 'Open'
  | 'Monitoring'

export interface SourceRef {
  reportId: string
  sourceStatus: string
}

export interface Accomplishment extends SourceRef {
  id: string
  title: string
  description: string
  workstream: string
  date: string
  period: string
  value: string
  status: Status
}

export interface Workstream extends SourceRef {
  id: string
  name: string
  status: Status
  currentFocus: string
  nextMilestone: string
  dependencies: string
  targetTiming: string
  recentAccomplishmentIds: string[]
}

export interface Milestone extends SourceRef {
  id: string
  title: string
  workstream: string
  horizon: 'Now' | 'Next' | 'Later'
  timing: string
  status: Status
  dependency: string
  lastUpdated: string
}

export interface Risk extends SourceRef {
  id: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  statement: string
  workstream: string
  mitigation: string
  attention: boolean
  lastUpdated: string
}

export interface Decision extends SourceRef {
  id: string
  request: string
  why: string
  timing: string
  consequence: string
  status: string
  publicClassification: 'Action requested' | 'For awareness'
}

export interface Report {
  id: string
  period: string
  date: string
  sourceBasis: string
  summary: string
  publicReportPath: string
  changes: string[]
  approval: {
    approvedBy: string
    approvedOn: string
    scope: string
  }
}

export interface DashboardData {
  schemaVersion: string
  snapshotId: string
  metadata: {
    title: string
    asOf: string
    reportingPeriod: string
    sourceBasis: string
    lastReviewed: string
    identity: string
    subidentity: string
    publicNotice: string
  }
  executiveSummary: string
  priorities: string[]
  accomplishments: Accomplishment[]
  workstreams: Workstream[]
  milestones: Milestone[]
  risks: Risk[]
  decisions: Decision[]
  reports: Report[]
}
