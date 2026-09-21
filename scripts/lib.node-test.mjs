import assert from 'node:assert/strict'
import test from 'node:test'
import { scanSensitive } from './lib.mjs'

test('does not mistake token costs for a credential', () => {
  assert.deepEqual(scanSensitive('Funding could cover token costs.'), [])
})

test('identifies a credential with a useful location and next step', () => {
  const [finding] = scanSensitive('Heading\nNever publish an API key.')
  assert.equal(finding.kind, 'credential')
  assert.equal(finding.line, 2)
  assert.equal(finding.matchedText, 'API key')
  assert.match(finding.excerpt, /API key/)
  assert.match(finding.guidance, /Remove the credential/)
})

test('identifies access tokens without flagging general token language', () => {
  const [finding] = scanSensitive('Do not publish an access token.')
  assert.equal(finding.kind, 'credential')
  assert.equal(finding.matchedText, 'access token')
})
