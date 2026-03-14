import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Role } from 'generated/prisma/client'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'

@Injectable()
export class WarehouseAccessGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req
    const args = ctx.getArgs()

    if (!request.user) {
      return throwGraphQLError({ message: 'Authentication required', code: 'UNAUTHORIZED' })
    }

    // Load user with role and companies if not already loaded
    if (!request.user.role || !request.user.companyIds) {
      await this.loadUserContext(request)
    }

    // ADMIN bypasses all checks
    if (request.user.role === Role.ADMIN) return true

    // Extract warehouse ID from args (supports 'id' or 'input.id')
    const warehouseId = args.id || args.input?.id

    if (!warehouseId) {
      return throwGraphQLError({
        message: 'Warehouse ID is required',
        code: 'WAREHOUSE_ID_REQUIRED'
      })
    }

    // Get the warehouse to check its company
    const warehouse = await this.prismaService.warehouse.findUnique({
      where: { id: warehouseId },
      select: { company_id: true }
    })

    if (!warehouse) {
      return throwGraphQLError({
        message: 'Warehouse not found',
        code: 'WAREHOUSE_NOT_FOUND'
      })
    }

    // Check if user has access to the warehouse's company
    const { companyIds = [] } = request.user

    if (!companyIds.includes(warehouse.company_id)) {
      return throwGraphQLError({
        message: 'You do not have access to this warehouse',
        code: 'WAREHOUSE_ACCESS_DENIED'
      })
    }

    return true
  }

  private async loadUserContext(request: any): Promise<void> {
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
  }
}
