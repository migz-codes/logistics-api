import { Injectable } from '@nestjs/common'
import { compare } from 'bcrypt'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { CreateUserInput } from '../users/dtos'
import { UserService } from '../users/users.service'
import { LoginInput } from './dtos'
import { JwtStrategy } from './jwt.strategy'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtStrategy: JwtStrategy
  ) {}

  private async generateTokens(id: string, email: string) {
    const payload = { sub: id, email }

    const accessToken = await this.jwtStrategy.signAccess(payload)
    const refreshToken = await this.jwtStrategy.signRefresh(payload)

    return { accessToken, refreshToken }
  }

  async login(input: LoginInput) {
    const user = await this.userService.findByEmail(input.email)
    const isPasswordValid = await compare(input.password, user.password)

    if (!isPasswordValid || !user)
      return throwGraphQLError({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' })

    delete user.password

    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email)

    return { accessToken, refreshToken, user }
  }

  async register(input: CreateUserInput) {
    const createdUser = await this.userService.create(input)

    const { accessToken, refreshToken } = await this.generateTokens(
      createdUser.id,
      createdUser.email
    )

    return { accessToken, refreshToken, user: createdUser }
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.jwtStrategy.validate(refreshToken)
    const user = await this.userService.findById(payload.sub)

    if (!payload || payload.type !== 'refresh' || !user)
      return throwGraphQLError({
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      })

    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
      user.id,
      user.email
    )

    return { accessToken, refreshToken: newRefreshToken, user }
  }
}
