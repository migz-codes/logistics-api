import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../users/users.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
  exports: [JwtModule, JwtStrategy],
  providers: [AuthService, AuthResolver, JwtStrategy],
  imports: [UserModule, ConfigModule, JwtModule.register({})]
})
export class AuthModule {}
