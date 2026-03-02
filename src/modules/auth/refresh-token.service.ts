import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async storeToken(userId: string, expiresAt: Date): Promise<string> {
    const created = await this.prisma.refreshToken.create({
      data: {
        userId,
        expiresAt
      }
    })

    return created.id
  }

  async validateAndInvalidateToken(jti: string): Promise<{ userId: string } | null> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { id: jti }
    })

    if (!token)
      return throwGraphQLError({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired refresh token'
      })

    if (token.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: jti } }).catch(() => {})

      return throwGraphQLError({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired refresh token'
      })
    }

    await this.prisma.refreshToken.delete({ where: { id: jti } })

    return { userId: token.userId }
  }

  async validateToken(jti: string): Promise<{ userId: string; tokenId: string } | null> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { id: jti }
    })

    if (!token || token.expiresAt < new Date())
      return throwGraphQLError({
        message: 'Invalid or expired refresh token',
        code: 'UNAUTHORIZED'
      })

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
      where: { expiresAt: { lt: new Date() } }
    })

    return result.count
  }
}
