import path from 'node:path'
import { readJson, root } from './lib.mjs'

const proposalId = process.argv[2]
if (!proposalId) throw new Error('Usage: npm run review-import -- <proposal-id>')
const proposal = await readJson(path.join(root, 'staging/imports', `${proposalId}.json`))
console.log(`# Review ${proposal.proposalId}`)
console.log(`Status: ${proposal.status}`)
console.log(`Source: ${proposal.source.path}`)
console.log(`Source hash: ${proposal.source.sha256}`)
console.log(`Base snapshot: ${proposal.baseSnapshotId}`)
console.log(`Sections: ${proposal.source.headings.join(', ') || 'None detected'}`)
console.log(`Sensitive findings: ${proposal.sensitiveFindings.length}`)
for (const finding of proposal.sensitiveFindings) console.log(`- ${finding.kind}: ${finding.resolution ?? 'UNRESOLVED'}`)
console.log('No current record changes status merely because the new report omitted it.')
