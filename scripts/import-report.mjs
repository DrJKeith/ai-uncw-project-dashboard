import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseReport, readJson, root, scanSensitive, sha256 } from './lib.mjs'

export async function importReport({ dashboardRoot = root, reportPath: supplied }) {
  if (!supplied) throw new Error('Usage: npm run import-report -- content/reports/<report-name>.md')
  const activeRoot = path.resolve(dashboardRoot)
  const reportPath = path.resolve(activeRoot, supplied)
  const reportsRoot = path.join(activeRoot, 'content/reports') + path.sep
  if (!reportPath.startsWith(reportsRoot)) throw new Error('Reports must be inside content/reports/.')

  const markdown = await readFile(reportPath, 'utf8')
  const metadata = parseReport(markdown)
  if (!metadata.reportingPeriod || !metadata.reportDate || !metadata.sourceBasis) throw new Error('Report must include Reporting period, Report date, and Source basis fields.')

  const current = await readJson(path.join(activeRoot, 'src/data/current.json'))
  const sourceHash = sha256(markdown)
  const proposalId = `proposal-${metadata.reportDate}-${sourceHash.slice(0, 8)}`
  const proposal = {
    proposalId,
    status: 'needs-review',
    createdAt: new Date().toISOString(),
    source: { path: path.relative(activeRoot, reportPath), sha256: sourceHash, ...metadata },
    baseSnapshotId: current.snapshotId,
    sensitiveFindings: scanSensitive(markdown),
    proposedChanges: {
      note: 'The importer does not infer production facts. Prepare the reviewed snapshot in the adjacent .approved-data.json file.',
      sourceSections: metadata.headings,
      omittedCurrentRecords: 'No change proposed',
    },
    approval: null,
  }
  const outputDir = path.join(activeRoot, 'staging/imports')
  const outputPath = path.join(outputDir, `${proposalId}.json`)
  await mkdir(outputDir, { recursive: true })
  try {
    await writeFile(outputPath, `${JSON.stringify(proposal, null, 2)}\n`, { flag: 'wx' })
    return { proposal, created: true }
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
    const existing = await readJson(outputPath)
    if (existing.source?.sha256 !== sourceHash || existing.baseSnapshotId !== current.snapshotId) throw new Error(`An existing proposal conflicts with ${proposalId}. Create a revised report instead.`)
    return { proposal: existing, created: false }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await importReport({ reportPath: process.argv[2] })
  console.log(`${result.created ? 'Created' : 'Already prepared'} ${result.proposal.proposalId}. Approved dashboard data was not changed.`)
  console.log(`Review with: npm run review-import -- ${result.proposal.proposalId}`)
}
