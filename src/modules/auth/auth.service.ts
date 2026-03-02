import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { CreateUserInput } from '../users/dtos'
import { UserService } from '../users/users.service'
import { LoginInput } from './dtos'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  private async generateTokens(id: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: id, type: 'access', email: email },
      { expiresIn: '5m' }
    )

    const refreshToken = await this.jwtService.signAsync(
      { sub: id, type: 'refresh', email: email },
      { expiresIn: '1d' }
    )

    return { accessToken, refreshToken }
  }

  async login(input: LoginInput) {
    const user = await this.userService.findByEmail(input.email)

    if (!user) return null

    const isPasswordValid = await compare(input.password, user.password)

    if (!isPasswordValid) return null

    delete user.password

    if (!user)
      return throwGraphQLError({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' })

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
    const payload = await this.jwtService.verifyAsync(refreshToken)

    if (payload.type !== 'refresh')
      return throwGraphQLError({ message: 'Invalid refresh token', code: 'INVALID_refreshToken' })

    const user = await this.userService.findById(payload.sub)

    if (!user)
      return throwGraphQLError({ message: 'Invalid refresh token', code: 'INVALID_refreshToken' })

    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
      user.id,
      user.email
    )

    return { accessToken, refreshToken: newRefreshToken, user }
  }
}
