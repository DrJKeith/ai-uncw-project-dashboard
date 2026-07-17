import { currentPath, readJson, validateDashboard } from './lib.mjs'

const data = await readJson(currentPath)
const errors = validateDashboard(data)
if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(`Validated ${data.snapshotId}: ${data.accomplishments.length} accomplishments, ${data.milestones.length} milestones, ${data.risks.length} public risks, ${data.reports.length} report.`)
