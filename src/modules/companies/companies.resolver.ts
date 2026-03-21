import { UseGuards } from '@nestjs/common'
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PaginationInput } from '@/src/common/dtos'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { AuthGuard } from '../auth/auth.guard'
import { IAuthenticatedRequest } from '../auth/dtos'
import { Roles } from '../roles/roles.decorator'
import { RolesGuard } from '../roles/roles.guard'
import { CompaniesService } from './companies.service'
import { Company } from './company.entity'
import { CompanyAccess } from './decorators/company-access.decorator'
import {
  CompanyFiltersInput,
  CreateCompanyInput,
  PaginatedCompaniesResponse,
  UpdateCompanyInput
} from './dtos'
import { CompanyAccessGuard } from './guards/company-access.guard'

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('INVESTOR_ADMIN', 'ADMIN')
  @Mutation(() => Company, { nullable: true })
  async createCompany(
    @Args('input') input: CreateCompanyInput,
    @Context('req') req: IAuthenticatedRequest
  ) {
    const user_id = req.user.id

    try {
      return await this.companiesService.create({ ...input, owner_id: user_id })
    } catch (error) {
      throwGraphQLError({
        error,
        code: 'COMPANY_CREATE_FAILED',
        message: 'Failed to create company'
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('INVESTOR_ADMIN', 'ADMIN')
  @Query(() => PaginatedCompaniesResponse, { name: 'getMyCompanies', nullable: true })
  async getMyCompanies(
    @Context('req') req: IAuthenticatedRequest,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Args('filters', { nullable: true }) filters?: CompanyFiltersInput
  ) {
    const user_id = req.user.id
    const paginationParams = pagination ?? { page: 1, take: 10 }

    try {
      return await this.companiesService.findByOwnerPaginated(user_id, paginationParams, filters)
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
  @Query(() => PaginatedCompaniesResponse, { name: 'companies', nullable: true })
  async findAll(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Args('filters', { nullable: true }) filters?: CompanyFiltersInput
  ) {
    const paginationParams = pagination ?? { page: 1, take: 10 }

    try {
      return await this.companiesService.findAllPaginated(paginationParams, filters)
    } catch (error) {
      throwGraphQLError({
        error,
        code: 'COMPANIES_FETCH_FAILED',
        message: 'Failed to fetch companies'
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

  @UseGuards(AuthGuard, CompanyAccessGuard)
  @CompanyAccess('member', 'id')
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

  @UseGuards(AuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles('INVESTOR_ADMIN', 'ADMIN')
  @CompanyAccess('owner', 'input.id')
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

  @UseGuards(AuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles('INVESTOR_ADMIN', 'ADMIN')
  @CompanyAccess('owner', 'id')
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

  @UseGuards(AuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles('INVESTOR_ADMIN', 'ADMIN')
  @CompanyAccess('owner', 'company_id')
  @Mutation(() => Company, { nullable: true })
  async addCompanyMember(
    @Args('company_id', { type: () => String }) company_id: string,
    @Args('user_id', { type: () => String }) user_id: string
  ) {
    try {
      return await this.companiesService.addMember(company_id, user_id)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to add member to company',
        code: 'COMPANY_ADD_MEMBER_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles('INVESTOR_ADMIN', 'ADMIN')
  @CompanyAccess('owner', 'company_id')
  @Mutation(() => Company, { nullable: true })
  async removeCompanyMember(
    @Args('company_id', { type: () => String }) company_id: string,
    @Args('user_id', { type: () => String }) user_id: string
  ) {
    try {
      return await this.companiesService.removeMember(company_id, user_id)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to remove member from company',
        code: 'COMPANY_REMOVE_MEMBER_FAILED',
        error
      })
    }
  }
}
