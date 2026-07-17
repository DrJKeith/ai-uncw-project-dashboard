import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { currentPath, readJson, root, sha256, validateDashboard } from './lib.mjs'

const proposalId = process.argv[2]
if (!proposalId) throw new Error('Usage: npm run apply-import -- <proposal-id>')
const proposalPath = path.join(root, 'staging/imports', `${proposalId}.json`)
const reviewedDataPath = path.join(root, 'staging/imports', `${proposalId}.approved-data.json`)
const proposal = await readJson(proposalPath)
if (proposal.status !== 'approved' || !proposal.approval) throw new Error('Proposal is not approved.')
const current = await readJson(currentPath)
if (current.snapshotId !== proposal.baseSnapshotId) throw new Error('The base snapshot changed; approval is stale.')
const reviewedText = await readFile(reviewedDataPath, 'utf8')
const reviewedData = JSON.parse(reviewedText)
if (sha256(JSON.stringify(reviewedData)) !== proposal.approval.reviewedDataSha256) throw new Error('Approved data changed after approval.')
const errors = validateDashboard(reviewedData)
if (errors.length) throw new Error(`Approved snapshot is invalid:\n${errors.join('\n')}`)
const snapshots = path.join(root, 'data/snapshots')
await mkdir(snapshots, { recursive: true })
await writeFile(path.join(snapshots, `${reviewedData.snapshotId}.json`), `${JSON.stringify(reviewedData, null, 2)}\n`, { flag: 'wx' })
await writeFile(currentPath, `${JSON.stringify(reviewedData, null, 2)}\n`)
proposal.status = 'applied'
proposal.appliedAt = new Date().toISOString()
await writeFile(proposalPath, `${JSON.stringify(proposal, null, 2)}\n`)
console.log(`Applied ${proposalId} as ${reviewedData.snapshotId}. Run npm run validate, npm test, and npm run build.`)
