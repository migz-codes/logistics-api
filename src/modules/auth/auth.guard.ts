import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) return throwGraphQLError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })

    try {
      const payload = await this.jwtService.verifyAsync(token)

      if (!payload.type || payload.type !== 'access')
        return throwGraphQLError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })

      request.user = { id: payload.sub }

      return true
    } catch {
      return throwGraphQLError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })
    }
  }
}
