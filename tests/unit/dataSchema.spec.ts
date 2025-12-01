import data from '../../src/data/evidence.json'
import { validateEvidence } from '../../src/utils/dataLoader'

describe('data schema validation', () => {
  it('matches expected shape', () => {
    expect(validateEvidence(data)).toBe(true)
  })
})
