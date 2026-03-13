import { Module } from '@nestjs/common'
import { PrismaModule } from '../../lib/prisma/prisma.module'
import { AuthModule } from '../auth/auth.module'
import { RolesModule } from '../roles/roles.module'
import { CompaniesResolver } from './companies.resolver'
import { CompaniesService } from './companies.service'

@Module({
  imports: [AuthModule, RolesModule, PrismaModule],
  providers: [CompaniesResolver, CompaniesService],
  exports: [CompaniesService]
})
export class CompaniesModule {}
