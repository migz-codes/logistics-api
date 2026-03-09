import { forwardRef, Module } from '@nestjs/common'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { UserResolver } from './users.resolver'
import { UserService } from './users.service'

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [UserResolver, UserService, PrismaService],
  exports: [UserService]
})
export class UserModule {}
