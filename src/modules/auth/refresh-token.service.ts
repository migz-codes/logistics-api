import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@/src/lib/prisma/prisma.service'

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name)

  constructor(private readonly prisma: PrismaService) {}

  async storeToken(userId: string, expiresAt: Date): Promise<string> {
    const created = await this.prisma.refreshToken.create({
      data: {
        userId,
        expiresAt
      }
    })

    this.logger.debug(`Stored new token ${created.id} for user ${userId}`)
    return created.id
  }

  async validateAndInvalidateToken(jti: string): Promise<{ userId: string } | null> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { id: jti }
    })

    if (!token) {
      this.logger.debug(`Token ${jti} not found`)
      return null
    }

    if (token.expiresAt < new Date()) {
      this.logger.debug(`Token ${jti} expired`)
      await this.prisma.refreshToken.delete({ where: { id: jti } }).catch(() => {})
      return null
    }

    await this.prisma.refreshToken.delete({ where: { id: jti } })
    this.logger.debug(`Token ${jti} deleted successfully`)

    return { userId: token.userId }
  }

  async validateToken(jti: string): Promise<{ userId: string; tokenId: string } | null> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { id: jti }
    })

    if (!token || token.expiresAt < new Date()) {
      return null
    }

    return { userId: token.userId, tokenId: token.id }
  }

  async invalidateToken(tokenId: string): Promise<void> {
    await this.prisma.refreshToken
      .delete({
        where: { id: tokenId }
      })
      .catch(() => {})
  }

  async invalidateAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId }
    })
  }

  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    })
    return result.count
  }
}
