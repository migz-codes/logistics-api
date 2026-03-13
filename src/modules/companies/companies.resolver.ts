import { Request, UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { AuthGuard } from '../auth/auth.guard'
import { IAuthenticatedRequest } from '../auth/dtos'
import { Roles } from '../roles/roles.decorator'
import { RolesGuard } from '../roles/roles.guard'
import { CompaniesService } from './companies.service'
import { Company } from './company.entity'
import { CompanyFiltersInput, CreateCompanyInput, UpdateCompanyInput } from './dtos'

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('INVESTOR_ADMIN', 'ADMIN')
  @Mutation(() => Company, { nullable: true })
  async createCompany(
    @Args('input') input: CreateCompanyInput,
    @Request() req: IAuthenticatedRequest
  ) {
    const userId = req.user.id

    try {
      return await this.companiesService.create({ ...input, owner_id: userId })
    } catch (error) {
      throwGraphQLError({
        error,
        code: 'COMPANY_CREATE_FAILED',
        message: 'Failed to create company'
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Query(() => [Company], { name: 'companies', nullable: true })
  async findAll(@Args('filters', { nullable: true }) filters?: CompanyFiltersInput) {
    try {
      return await this.companiesService.findAll(filters)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to fetch companies',
        code: 'COMPANIES_FETCH_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Query(() => Int, { name: 'companiesCount' })
  async count(@Args('filters', { nullable: true }) filters?: CompanyFiltersInput) {
    try {
      return await this.companiesService.count(filters)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to count companies',
        code: 'COMPANIES_COUNT_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard)
  @Query(() => Company, { name: 'company', nullable: true })
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.companiesService.findOne(id)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to fetch company',
        code: 'COMPANY_FETCH_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('INVESTOR_ADMIN', 'ADMIN')
  @Mutation(() => Company, { nullable: true })
  async updateCompany(@Args('input') input: UpdateCompanyInput) {
    try {
      return await this.companiesService.update(input)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to update company',
        code: 'COMPANY_UPDATE_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('INVESTOR_ADMIN', 'ADMIN')
  @Mutation(() => Company, { nullable: true })
  async removeCompany(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.companiesService.remove(id)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to remove company',
        code: 'COMPANY_DELETE_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('INVESTOR_ADMIN', 'ADMIN')
  @Mutation(() => Company, { nullable: true })
  async addCompanyMember(
    @Args('companyId', { type: () => String }) companyId: string,
    @Args('userId', { type: () => String }) userId: string
  ) {
    try {
      return await this.companiesService.addMember(companyId, userId)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to add member to company',
        code: 'COMPANY_ADD_MEMBER_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('INVESTOR_ADMIN', 'ADMIN')
  @Mutation(() => Company, { nullable: true })
  async removeCompanyMember(
    @Args('companyId', { type: () => String }) companyId: string,
    @Args('userId', { type: () => String }) userId: string
  ) {
    try {
      return await this.companiesService.removeMember(companyId, userId)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to remove member from company',
        code: 'COMPANY_REMOVE_MEMBER_FAILED',
        error
      })
    }
  }
}
