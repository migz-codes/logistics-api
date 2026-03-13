import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { PrismaModule } from '../../lib/prisma/prisma.module'
import { AuthModule } from '../auth/auth.module'
import { RolesModule } from '../roles/roles.module'
import { CompaniesResolver } from './companies.resolver'
import { CompaniesService } from './companies.service'
import { CompanyAccessGuard } from './guards/company-access.guard'
import { CompanyContextInterceptor } from './interceptors/company-context.interceptor'

@Module({
  imports: [AuthModule, RolesModule, PrismaModule],
  providers: [
    CompaniesResolver,
    CompaniesService,
    CompanyAccessGuard,
    { provide: APP_INTERCEPTOR, useClass: CompanyContextInterceptor }
  ],
  exports: [CompaniesService]
})
export class CompaniesModule {}
