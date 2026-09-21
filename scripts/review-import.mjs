import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { readJson, root, scanSensitive } from './lib.mjs'

const proposalId = process.argv[2]
if (!proposalId) throw new Error('Usage: npm run review-import -- <proposal-id>')
const proposal = await readJson(path.join(root, 'staging/imports', `${proposalId}.json`))
const source = await readFile(path.join(root, proposal.source.path), 'utf8')
const sensitiveFindings = scanSensitive(source)
console.log(`# Review ${proposal.proposalId}`)
console.log(`Status: ${proposal.status}`)
console.log(`Source: ${proposal.source.path}`)
console.log(`Source hash: ${proposal.source.sha256}`)
console.log(`Base snapshot: ${proposal.baseSnapshotId}`)
console.log(`Sections: ${proposal.source.headings.join(', ') || 'None detected'}`)
console.log(`Sensitive findings: ${sensitiveFindings.length}`)
if (proposal.sensitiveFindings.length && !sensitiveFindings.length) {
  console.log('No current alert found. A prior generic alert no longer matches the public-safety rule.')
}
for (const finding of sensitiveFindings) {
  const location = finding.line ? `line ${finding.line}` : 'location unavailable (created by an older proposal)'
  const matchedText = finding.matchedText ? `matched “${finding.matchedText}”` : null
  console.log(`- ${finding.kind}: ${finding.resolution ?? 'UNRESOLVED'} — ${[location, matchedText].filter(Boolean).join('; ')}`)
  if (finding.excerpt) console.log(`  “${finding.excerpt}”`)
  if (finding.guidance) console.log(`  Next step: ${finding.guidance}`)
}
console.log('No current record changes status merely because the new report omitted it.')
