import { describe, expect, it } from 'vitest'
import {
  companyBillingQueryKey,
  companyCollaboratorsQueryKey,
  companyOverviewQueryKey,
} from './useCompanyWorkspace'

describe('company workspace query keys', () => {
  it('keeps company workspace and collaborator caches separate by company', () => {
    expect(companyOverviewQueryKey('company-a')).not.toEqual(companyOverviewQueryKey('company-b'))
    expect(companyBillingQueryKey('company-a')).not.toEqual(companyBillingQueryKey('company-b'))
    expect(companyCollaboratorsQueryKey('company-a')).not.toEqual(
      companyCollaboratorsQueryKey('company-b')
    )
  })
})
