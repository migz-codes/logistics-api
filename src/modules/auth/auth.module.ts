import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ScheduleModule } from '@nestjs/schedule'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { UserModule } from '../users/users.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { RefreshTokenService } from './refresh-token.service'
import { RolesGuard } from './roles.guard'
import { TokenCleanupTask } from './token-cleanup.task'

@Module({
  exports: [JwtModule, JwtStrategy, RolesGuard],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    RefreshTokenService,
    PrismaService,
    TokenCleanupTask,
    RolesGuard
  ],
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    JwtModule.register({}),
    ScheduleModule.forRoot()
  ]
})
export class AuthModule {}
