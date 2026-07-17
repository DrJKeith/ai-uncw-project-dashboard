import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const root = process.cwd()
export const currentPath = path.join(root, 'src/data/current.json')

export const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'))
export const sha256 = (text) => createHash('sha256').update(text).digest('hex')

export function validateDashboard(data) {
  const errors = []
  const required = ['schemaVersion', 'snapshotId', 'metadata', 'executiveSummary', 'priorities', 'accomplishments', 'workstreams', 'milestones', 'risks', 'decisions', 'reports']
  for (const key of required) if (!(key in data)) errors.push(`Missing top-level field: ${key}`)
  if (data.schemaVersion !== '1.0.0') errors.push('schemaVersion must be 1.0.0')
  if (!String(data.snapshotId ?? '').startsWith('snapshot-')) errors.push('snapshotId must start with snapshot-')
  if (!Array.isArray(data.workstreams) || data.workstreams.length !== 6) errors.push('Exactly six workstreams are required')
  if (!Array.isArray(data.priorities) || data.priorities.length < 1 || data.priorities.length > 6) errors.push('Priorities must contain 1–6 items')

  const collections = ['accomplishments', 'workstreams', 'milestones', 'risks', 'decisions', 'reports']
  const ids = new Set()
  for (const name of collections) {
    if (!Array.isArray(data[name])) { errors.push(`${name} must be an array`); continue }
    for (const item of data[name]) {
      if (!item.id) errors.push(`${name} record is missing id`)
      else if (ids.has(item.id)) errors.push(`Duplicate stable id: ${item.id}`)
      else ids.add(item.id)
    }
  }

  const reportIds = new Set((data.reports ?? []).map((report) => report.id))
  for (const name of ['accomplishments', 'workstreams', 'milestones', 'risks', 'decisions']) {
    for (const item of data[name] ?? []) if (!reportIds.has(item.reportId)) errors.push(`${item.id} references missing report ${item.reportId}`)
  }

  const forbidden = [
    /gaabs-chief-of-staff/i,
    /\/Users\//,
    /confidential stakeholder/i,
    /private personnel/i,
  ]
  const serialized = JSON.stringify(data)
  for (const pattern of forbidden) if (pattern.test(serialized)) errors.push(`Public-data safety check matched ${pattern}`)
  return errors
}

export function parseReport(markdown) {
  const field = (label) => markdown.match(new RegExp(`^${label}:\\s*(.+)$`, 'im'))?.[1]?.trim() ?? null
  const headings = [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim())
  return {
    reportingPeriod: field('Reporting period'),
    reportDate: field('Report date'),
    sourceBasis: field('Source basis'),
    headings,
  }
}

export function scanSensitive(markdown) {
  const checks = [
    ['confidential', /\bconfidential\b/i],
    ['personnel', /\b(personnel|performance review|disciplinary)\b/i],
    ['student record', /\b(student id|student record|ferpa)\b/i],
    ['private contact data', /\b\d{3}[-.)\s]\d{3}[-.\s]\d{4}\b/],
    ['credential', /\b(api[_ -]?key|password|secret|token)\b/i],
    ['internal deliberation', /\b(internal deliberation|not for distribution|closed session)\b/i],
  ]
  return checks.filter(([, pattern]) => pattern.test(markdown)).map(([kind]) => ({ kind, resolution: null }))
}
