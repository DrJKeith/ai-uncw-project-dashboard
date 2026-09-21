import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { currentPath, readJson, root, scanSensitive, sha256, validateDashboard } from './lib.mjs'

const proposalId = process.argv[2]
if (!proposalId) throw new Error('Usage: npm run approve-import -- <proposal-id>')
const proposalPath = path.join(root, 'staging/imports', `${proposalId}.json`)
const reviewedDataPath = path.join(root, 'staging/imports', `${proposalId}.approved-data.json`)
const proposal = await readJson(proposalPath)
if (proposal.status !== 'needs-review') throw new Error(`Proposal status is ${proposal.status}, not needs-review.`)
const source = await readFile(path.join(root, proposal.source.path), 'utf8')
if (sha256(source) !== proposal.source.sha256) throw new Error('The source report changed; create a new proposal.')
const sensitiveFindings = scanSensitive(source)
const unresolvedFindings = sensitiveFindings.filter((finding) => !finding.resolution)
if (unresolvedFindings.length) {
  const details = unresolvedFindings.map((finding) => {
    const location = finding.line ? `line ${finding.line}` : 'location unavailable'
    const match = finding.matchedText ? ` (“${finding.matchedText}”)` : ''
    return `- ${finding.kind}${match} at ${location}${finding.guidance ? `: ${finding.guidance}` : ''}`
  }).join('\n')
  throw new Error(`Approval paused: ${unresolvedFindings.length} public-safety alert${unresolvedFindings.length === 1 ? '' : 's'} need review.\n${details}\nRun: npm run review-import -- ${proposalId}`)
}
const current = await readJson(currentPath)
if (current.snapshotId !== proposal.baseSnapshotId) throw new Error('The base snapshot changed; create a new proposal.')
const reviewedData = await readJson(reviewedDataPath)
const errors = validateDashboard(reviewedData)
if (errors.length) throw new Error(`Reviewed snapshot is invalid:\n${errors.join('\n')}`)
proposal.status = 'approved'
proposal.sensitiveFindings = sensitiveFindings
proposal.approval = { approvedBy: 'Julian Keith', approvedAt: new Date().toISOString(), reviewedDataSha256: sha256(JSON.stringify(reviewedData)) }
await writeFile(proposalPath, `${JSON.stringify(proposal, null, 2)}\n`)
console.log(`Approved ${proposalId}. The dashboard was not changed.`)
