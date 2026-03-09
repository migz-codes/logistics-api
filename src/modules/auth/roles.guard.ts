import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Role } from 'generated/prisma/client'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { JwtStrategy } from './jwt.strategy'
import { ROLES_KEY } from './roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtStrategy: JwtStrategy,
    private readonly prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) {
      return throwGraphQLError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })
    }

    const payload = await this.jwtStrategy.validate(token)

    if (!payload || payload.type !== 'access') {
      return throwGraphQLError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
      select: { role: true }
    })

    if (!user) {
      return throwGraphQLError({ message: 'User not found', code: 'USER_NOT_FOUND' })
    }

    request.user = { id: payload.sub, role: user.role }

    const hasRole = requiredRoles.includes(user.role)

    if (!hasRole) {
      return throwGraphQLError({ message: 'Forbidden', code: 'FORBIDDEN' })
    }

    return true
  }
}
