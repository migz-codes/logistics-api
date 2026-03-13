import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Role } from 'generated/prisma/client'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { ROLES_KEY } from './roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRoles || requiredRoles.length === 0) return true

    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req

    // User should already be authenticated by AuthGuard
    if (!request.user) {
      return throwGraphQLError({ message: 'User not authenticated', code: 'UNAUTHORIZED' })
    }

    // Get user role from database if not already set
    if (!request.user.role) {
      const user = await this.prismaService.user.findUnique({
        where: { id: request.user.id },
        select: { role: true }
      })

      if (!user) return throwGraphQLError({ message: 'User not found', code: 'USER_NOT_FOUND' })

      request.user.role = user.role
    }

    const hasRole = requiredRoles.includes(request.user.role)

    if (!hasRole) return throwGraphQLError({ message: 'Forbidden', code: 'FORBIDDEN' })

    return true
  }
}
