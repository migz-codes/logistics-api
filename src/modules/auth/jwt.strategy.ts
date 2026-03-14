import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { convertToSeconds } from '@/src/lib/utils/time.util'

export interface JwtPayload {
  sub: string
  email: string
  type: 'access' | 'refresh'
  jti?: string
}

export const TOKEN_EXPIRY = {
  ACCESS: process.env.JWT_ACCESS_EXPIRY || '5m',
  REFRESH: process.env.JWT_REFRESH_EXPIRY || '14d'
} as const

@Injectable()
export class JwtStrategy {
  private readonly secret: string

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET')
  }

  async validate(token: string): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.secret
      })
      return payload
    } catch {
      return null
    }
  }

  async sign(payload: Omit<JwtPayload, 'type'>, expiresIn: string): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.secret,
      expiresIn: convertToSeconds(expiresIn)
    })
  }

  async signAccess(payload: Omit<JwtPayload, 'type'>): Promise<string> {
    return this.jwtService.signAsync(
      { ...payload, type: 'access' },
      { secret: this.secret, expiresIn: convertToSeconds(TOKEN_EXPIRY.ACCESS) }
    )
  }

  async signRefresh(payload: Omit<JwtPayload, 'type'>, jti: string): Promise<string> {
    return this.jwtService.signAsync(
      {
        ...payload,
        type: 'refresh',
        jti
      },
      {
        secret: this.secret,
        expiresIn: convertToSeconds(TOKEN_EXPIRY.REFRESH)
      }
    )
  }

  getRefreshTokenExpiryDate(): Date {
    const expiresAt = new Date()
    const seconds = convertToSeconds(TOKEN_EXPIRY.REFRESH)
    expiresAt.setSeconds(expiresAt.getSeconds() + seconds)
    return expiresAt
  }
}
