import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

export interface JwtPayload {
  sub: string
  email: string
  type: 'access' | 'refresh'
}

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
      expiresIn: this.convertToSeconds(expiresIn)
    })
  }

  async signAccess(payload: Omit<JwtPayload, 'type'>): Promise<string> {
    return this.sign(payload, '5m')
  }

  async signRefresh(payload: Omit<JwtPayload, 'type'>): Promise<string> {
    return this.jwtService.signAsync(
      {
        ...payload,
        type: 'refresh'
      },
      {
        secret: this.secret,
        expiresIn: this.convertToSeconds('1d')
      }
    )
  }

  private convertToSeconds(timeString: string): number {
    const units: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400
    }

    const match = timeString.match(/^(\d+)([smhd])$/)

    if (!match)
      throw new Error(`Invalid time format: ${timeString}. Use format like "5m", "1h", "7d"`)

    const [, value, unit] = match
    return parseInt(value, 10) * units[unit]
  }
}
