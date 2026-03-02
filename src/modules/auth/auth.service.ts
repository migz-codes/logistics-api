import { Injectable } from '@nestjs/common'
import { compare } from 'bcrypt'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { CreateUserInput } from '../users/dtos'
import { UserService } from '../users/users.service'
import { LoginInput } from './dtos'
import { JwtStrategy } from './jwt.strategy'
import { RefreshTokenService } from './refresh-token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtStrategy: JwtStrategy,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  private async generateTokens(id: string, email: string) {
    const payload = { sub: id, email }
    const expiresAt = this.jwtStrategy.getRefreshTokenExpiryDate()

    const jti = await this.refreshTokenService.storeToken(id, expiresAt)

    const accessToken = await this.jwtStrategy.signAccess(payload)
    const refreshToken = await this.jwtStrategy.signRefresh(payload, jti)

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

    if (!payload || payload.type !== 'refresh' || !payload.jti)
      return throwGraphQLError({
        message: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      })

    const storedToken = await this.refreshTokenService.validateAndInvalidateToken(payload.jti)

    if (!storedToken)
      return throwGraphQLError({
        message: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      })

    const user = await this.userService.findById(payload.sub)

    if (!user)
      return throwGraphQLError({
        message: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      })

    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
      user.id,
      user.email
    )

    return { accessToken, refreshToken: newRefreshToken, user }
  }

  async logout(refreshToken: string): Promise<boolean> {
    const payload = await this.jwtStrategy.validate(refreshToken)
    if (payload?.jti) {
      await this.refreshTokenService.invalidateToken(payload.jti)
    }
    return true
  }

  async logoutAll(userId: string): Promise<boolean> {
    await this.refreshTokenService.invalidateAllUserTokens(userId)
    return true
  }
}
