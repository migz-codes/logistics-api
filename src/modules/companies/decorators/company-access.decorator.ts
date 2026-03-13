import { SetMetadata } from '@nestjs/common'

export type CompanyAccessLevel = 'owner' | 'member'

export interface CompanyAccessOptions {
  level: CompanyAccessLevel
  companyIdArg: string // e.g., 'id', 'input.id', 'companyId', 'input.company_id'
}

export const COMPANY_ACCESS_KEY = 'company_access'
export const CompanyAccess = (level: CompanyAccessLevel, companyIdArg: string) =>
  SetMetadata(COMPANY_ACCESS_KEY, { level, companyIdArg } as CompanyAccessOptions)
