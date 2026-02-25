import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) return throwGraphQLError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })

    try {
      const user = await this.jwtService.verifyAsync(token)

      request.user = {
        id: user.id
      }

      return true
    } catch {
      return throwGraphQLError({ message: 'Unauthorized', code: 'UNAUTHORIZED' })
    }
  }
}
