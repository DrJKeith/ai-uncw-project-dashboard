import { describe, expect, it } from 'vitest'
import data from './data/current.json'

describe('approved dashboard snapshot', () => {
  it('uses the current public identity', () => {
    expect(data.metadata.title).toBe('AI@UNCW Project Dashboard')
    expect(data.metadata.identity).toBe('The AI Hub Orchestrates and GAABS Supports AI Builders.')
  })

  it('contains exactly the six authorized workstreams', () => {
    expect(data.workstreams.map((item) => item.name)).toEqual([
      'Staff and Faculty Development',
      'Student AI Literacy',
      'Governance',
      'Infrastructure',
      'Research',
      'Communications',
    ])
  })

  it('excludes public decision rows when none are approved', () => {
    expect(data.decisions).toHaveLength(0)
  })

  it('does not expose the internal Chancellor-memo wording', () => {
    expect(JSON.stringify(data)).not.toMatch(/Chancellor/i)
  })

  it('keeps every substantive record tied to an archived report', () => {
    const reportIds = new Set(data.reports.map((report) => report.id))
    for (const collection of [data.accomplishments, data.workstreams, data.milestones, data.risks, data.decisions]) {
      for (const item of collection) expect(reportIds.has(item.reportId)).toBe(true)
    }
  })
})
