import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { JwtStrategy } from './jwt.strategy'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextType = context.getType<string>()

    // Handle HTTP/REST requests
    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest()
      const token = request.headers.authorization?.split(' ')[1]

      if (!token) {
        throw new UnauthorizedException('Unauthorized')
      }

      const payload = await this.jwtStrategy.validate(token)

      if (!payload || payload.type !== 'access') {
        throw new UnauthorizedException('Unauthorized')
      }

      request.user = { id: payload.sub }
      return true
    }

    // Handle GraphQL requests
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) return throwGraphQLError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })

    const payload = await this.jwtStrategy.validate(token)

    if (!payload || payload.type !== 'access')
      return throwGraphQLError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })

    request.user = { id: payload.sub }

    return true
  }
}
