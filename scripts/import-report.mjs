import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { currentPath, parseReport, readJson, root, scanSensitive, sha256 } from './lib.mjs'

const supplied = process.argv[2]
if (!supplied) throw new Error('Usage: npm run import-report -- content/reports/<report-name>.md')
const reportPath = path.resolve(root, supplied)
const reportsRoot = path.join(root, 'content/reports') + path.sep
if (!reportPath.startsWith(reportsRoot)) throw new Error('Reports must be inside content/reports/.')

const markdown = await readFile(reportPath, 'utf8')
const metadata = parseReport(markdown)
if (!metadata.reportingPeriod || !metadata.reportDate || !metadata.sourceBasis) throw new Error('Report must include Reporting period, Report date, and Source basis fields.')

const current = await readJson(currentPath)
const hash = sha256(markdown)
const proposalId = `proposal-${metadata.reportDate}-${hash.slice(0, 8)}`
const proposal = {
  proposalId,
  status: 'needs-review',
  createdAt: new Date().toISOString(),
  source: { path: path.relative(root, reportPath), sha256: hash, ...metadata },
  baseSnapshotId: current.snapshotId,
  sensitiveFindings: scanSensitive(markdown),
  proposedChanges: {
    note: 'The importer does not infer production facts. Prepare the reviewed snapshot in the adjacent .approved-data.json file.',
    sourceSections: metadata.headings,
    omittedCurrentRecords: 'No change proposed',
  },
  approval: null,
}
const outputDir = path.join(root, 'staging/imports')
await mkdir(outputDir, { recursive: true })
await writeFile(path.join(outputDir, `${proposalId}.json`), `${JSON.stringify(proposal, null, 2)}\n`, { flag: 'wx' })
console.log(`Created ${proposalId}. Approved dashboard data was not changed.`)
console.log(`Review with: npm run review-import -- ${proposalId}`)
