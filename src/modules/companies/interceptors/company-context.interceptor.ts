import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { PrismaService } from '@/src/lib/prisma/prisma.service'

@Injectable()
export class CompanyContextInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req

    if (!request.user?.id) {
      return next.handle()
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: request.user.id },
      select: {
        role: true,
        companies: { select: { id: true } },
        member_of: { select: { id: true } }
      }
    })

    if (user) {
      const ownedCompanyIds = user.companies.map((c) => c.id)
      const memberCompanyIds = user.member_of.map((c) => c.id)
      const allCompanyIds = [...new Set([...ownedCompanyIds, ...memberCompanyIds])]

      request.user.role = user.role
      request.user.ownedCompanyIds = ownedCompanyIds
      request.user.companyIds = allCompanyIds
    }

    return next.handle()
  }
}
