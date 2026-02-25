import { Module } from '@nestjs/common'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { UserResolver } from './users.resolver'
import { UserService } from './users.service'

@Module({ providers: [UserResolver, UserService, PrismaService], exports: [UserService] })
export class UserModule {}
