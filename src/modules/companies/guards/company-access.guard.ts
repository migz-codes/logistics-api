import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Role } from 'generated/prisma/client'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { COMPANY_ACCESS_KEY, CompanyAccessOptions } from '../decorators/company-access.decorator'

@Injectable()
export class CompanyAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessOptions = this.reflector.getAllAndOverride<CompanyAccessOptions>(
      COMPANY_ACCESS_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (!accessOptions) return true

    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req
    const args = ctx.getArgs()

    if (!request.user)
      return throwGraphQLError({ message: 'Authentication required', code: 'UNAUTHORIZED' })

    if (request.user.role === Role.ADMIN) return true

    const companyId = this.extractCompanyId(args, accessOptions.companyIdArg)

    if (!companyId) {
      return throwGraphQLError({
        message: `Company ID not found at '${accessOptions.companyIdArg}'`,
        code: 'COMPANY_ID_REQUIRED'
      })
    }

    const { ownedCompanyIds = [], companyIds = [] } = request.user

    if (accessOptions.level === 'owner') {
      if (!ownedCompanyIds.includes(companyId)) {
        return throwGraphQLError({
          message: 'Only company owner can perform this action',
          code: 'COMPANY_OWNER_REQUIRED'
        })
      }
    }

    if (accessOptions.level === 'member') {
      if (!companyIds.includes(companyId)) {
        return throwGraphQLError({
          message: 'You must be a member of this company to access it',
          code: 'COMPANY_MEMBER_REQUIRED'
        })
      }
    }

    return true
  }

  private extractCompanyId(args: Record<string, any>, path: string): string | null {
    const keys = path.split('.')
    let value: any = args

    for (const key of keys) {
      if (value == null) return null
      value = value[key]
    }

    return typeof value === 'string' ? value : null
  }
}
