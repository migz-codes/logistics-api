import { Module } from '@nestjs/common'
import { PrismaModule } from '../../lib/prisma/prisma.module'
import { AuthModule } from '../auth/auth.module'
import { RolesModule } from '../roles/roles.module'
import { CompaniesResolver } from './companies.resolver'
import { CompaniesService } from './companies.service'
import { CompanyAccessGuard } from './guards/company-access.guard'

@Module({
  imports: [AuthModule, RolesModule, PrismaModule],
  providers: [CompaniesResolver, CompaniesService, CompanyAccessGuard],
  exports: [CompaniesService, CompanyAccessGuard]
})
export class CompaniesModule {}
