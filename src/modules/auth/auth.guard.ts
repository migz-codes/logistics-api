import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { JwtStrategy } from './jwt.strategy'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
