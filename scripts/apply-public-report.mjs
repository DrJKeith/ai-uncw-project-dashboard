import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

export async function applyPublicReport({ dashboardRoot, reportPath: supplied, approvedBy = 'Julian Keith' }) {
  const root = path.resolve(dashboardRoot)
  const reportPath = path.resolve(root, supplied)
  const reportsRoot = path.join(root, 'content', 'reports') + path.sep
  if (!reportPath.startsWith(reportsRoot)) throw new Error('Public reports must be inside content/reports/.')

  const lib = await import(pathToFileURL(path.join(here, 'lib.mjs')).href)
  const source = await readFile(reportPath, 'utf8')
  const metadata = lib.parseReport(source)
  if (!metadata.reportingPeriod || !metadata.reportDate || !metadata.sourceBasis) throw new Error('The public report is missing reporting period, report date, or source basis.')
  const findings = lib.scanSensitive(source)
  if (findings.length) throw new Error(`Public-safety review is not complete: ${findings.map((finding) => `${finding.kind} on line ${finding.line}`).join(', ')}.`)

  const currentPath = path.join(root, 'src', 'data', 'current.json')
  const current = JSON.parse(await readFile(currentPath, 'utf8'))
  const sourceHash = lib.sha256(source)
  const reportId = `report-${metadata.reportDate}-${sourceHash.slice(0, 8)}`
  const existing = current.reports.find((report) => report.id === reportId)
  if (existing) return { applied: false, noOp: true, reportId, snapshotId: current.snapshotId }

  const fileName = path.basename(reportPath)
  const report = {
    id: reportId,
    period: `${metadata.reportingPeriod} — public update`,
    date: metadata.reportDate,
    sourceBasis: metadata.sourceBasis,
    summary: 'Reviewed public report submitted from AI Hub Operations. No structured dashboard records were changed automatically.',
    publicReportPath: `content/reports/${fileName}`,
    changes: ['Added the reviewed public report to Dashboard history', 'Preserved existing structured records; no claims were inferred from report text'],
    approval: {
      approvedBy,
      approvedOn: new Date().toISOString().slice(0, 10),
      scope: 'Explicitly reviewed public report; report history only unless separate structured changes are approved'
    }
  }
  const next = JSON.parse(JSON.stringify(current))
  next.snapshotId = `snapshot-${metadata.reportDate}-${sourceHash.slice(0, 8)}`
  next.metadata = { ...next.metadata, asOf: metadata.reportDate, reportingPeriod: metadata.reportingPeriod, lastReviewed: metadata.reportDate }
  next.reports = [...next.reports, report]
  const errors = lib.validateDashboard(next)
  if (errors.length) throw new Error(`The generated public update is invalid:\n${errors.join('\n')}`)

  const proposalId = `proposal-${metadata.reportDate}-${sourceHash.slice(0, 8)}`
  const proposal = {
    proposalId,
    status: 'applied',
    createdAt: new Date().toISOString(),
    source: { path: path.relative(root, reportPath), sha256: sourceHash, ...metadata },
    baseSnapshotId: current.snapshotId,
    sensitiveFindings: [],
    proposedChanges: { note: 'Applied from the reviewed AI Hub Operations public-report flow.', omittedCurrentRecords: 'No change proposed' },
    approval: { approvedBy, approvedAt: new Date().toISOString(), reviewedDataSha256: lib.sha256(JSON.stringify(next)) },
    appliedAt: new Date().toISOString()
  }
  await mkdir(path.join(root, 'data', 'snapshots'), { recursive: true })
  await mkdir(path.join(root, 'public', 'reports'), { recursive: true })
  await writeFile(path.join(root, 'public', 'reports', fileName), source)
  await writeFile(path.join(root, 'data', 'snapshots', `${next.snapshotId}.json`), `${JSON.stringify(next, null, 2)}\n`, { flag: 'wx' })
  await writeFile(currentPath, `${JSON.stringify(next, null, 2)}\n`)
  await mkdir(path.join(root, 'staging', 'imports'), { recursive: true })
  await writeFile(path.join(root, 'staging', 'imports', `${proposalId}.json`), `${JSON.stringify(proposal, null, 2)}\n`)
  await writeFile(path.join(root, 'staging', 'imports', `${proposalId}.approved-data.json`), `${JSON.stringify(next, null, 2)}\n`)
  return { applied: true, noOp: false, reportId, snapshotId: next.snapshotId, proposalId }
}
