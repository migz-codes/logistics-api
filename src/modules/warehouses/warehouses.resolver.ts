import { UseGuards } from '@nestjs/common'
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Role } from 'generated/prisma/client'
import { PaginationInput } from '@/src/common/dtos'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { AuthGuard } from '../auth/auth.guard'
import { IAuthenticatedRequest } from '../auth/dtos'
import { Roles } from '../roles/roles.decorator'
import { RolesGuard } from '../roles/roles.guard'
import {
  CreateWarehouseInput,
  PaginatedWarehousesResponse,
  UpdateWarehouseInput,
  WarehouseFiltersInput
} from './dtos'
import { WarehouseAccessGuard } from './guards/warehouse-access.guard'
import { Warehouse } from './warehouse.entity'
import { WarehousesService } from './warehouses.service'

@Resolver(() => Warehouse)
export class WarehousesResolver {
  constructor(private readonly warehousesService: WarehousesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INVESTOR_ADMIN, Role.INVESTOR)
  @Mutation(() => Warehouse, { nullable: true })
  async createWarehouse(
    @Args('input') input: CreateWarehouseInput,
    @Context() ctx: { req: IAuthenticatedRequest }
  ) {
    const userId = ctx.req.user.id

    // Validate that user has access to the company
    const hasAccess =
      ctx.req.user.role === Role.ADMIN ||
      (await this.warehousesService.validateCompanyAccess(userId, input.company_id))

    if (!hasAccess) {
      return throwGraphQLError({
        message: 'You do not have access to this company',
        code: 'COMPANY_ACCESS_DENIED'
      })
    }

    try {
      return await this.warehousesService.create({ ...input, accountable_id: userId })
    } catch (error) {
      throwGraphQLError({
        error,
        code: 'WAREHOUSE_CREATE_FAILED',
        message: 'Failed to create warehouse'
      })
    }
  }

  @Query(() => PaginatedWarehousesResponse, { name: 'warehouses', nullable: true })
  async findAll(
    @Args('filters', { nullable: true }) filters?: WarehouseFiltersInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput
  ) {
    const paginationParams = pagination ?? { page: 1, take: 10 }

    try {
      return await this.warehousesService.findAllPaginated(filters, paginationParams)
    } catch (error) {
      console.error('Failed to fetch warehouses:', error)
      throwGraphQLError({
        message: 'Failed to fetch warehouses',
        code: 'WAREHOUSES_FETCH_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard)
  @Query(() => Int, { name: 'warehousesCount' })
  async count(@Args('filters', { nullable: true }) filters?: WarehouseFiltersInput) {
    try {
      return await this.warehousesService.count(filters)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to count warehouses',
        code: 'WAREHOUSES_COUNT_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard)
  @Query(() => Warehouse, { name: 'warehouse', nullable: true })
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.warehousesService.findOne(id)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to fetch warehouse',
        code: 'WAREHOUSE_FETCH_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard, WarehouseAccessGuard)
  @Roles(Role.ADMIN, Role.INVESTOR_ADMIN, Role.INVESTOR)
  @Mutation(() => Warehouse, { nullable: true })
  async updateWarehouse(@Args('input') input: UpdateWarehouseInput) {
    try {
      return await this.warehousesService.update(input)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to update warehouse',
        code: 'WAREHOUSE_UPDATE_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard, WarehouseAccessGuard)
  @Roles(Role.ADMIN, Role.INVESTOR_ADMIN)
  @Mutation(() => Warehouse, { nullable: true })
  async removeWarehouse(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.warehousesService.remove(id)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to remove warehouse',
        code: 'WAREHOUSE_DELETE_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard, WarehouseAccessGuard)
  @Roles(Role.ADMIN, Role.INVESTOR_ADMIN, Role.INVESTOR)
  @Mutation(() => Warehouse, { nullable: true })
  async addWarehouseImages(
    @Args('id', { type: () => String }) id: string,
    @Args('imageUrls', { type: () => [String] }) imageUrls: string[]
  ) {
    try {
      return await this.warehousesService.addImages(id, imageUrls)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to add warehouse images',
        code: 'WAREHOUSE_ADD_IMAGES_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard, RolesGuard, WarehouseAccessGuard)
  @Roles(Role.ADMIN, Role.INVESTOR_ADMIN, Role.INVESTOR)
  @Mutation(() => Warehouse, { nullable: true })
  async removeWarehouseImage(
    @Args('id', { type: () => String }) id: string,
    @Args('imageUrl', { type: () => String }) imageUrl: string
  ) {
    try {
      return await this.warehousesService.removeImage(id, imageUrl)
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to remove warehouse image',
        code: 'WAREHOUSE_REMOVE_IMAGE_FAILED',
        error
      })
    }
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedWarehousesResponse, { name: 'myWarehouses', nullable: true })
  async getMyProperties(
    @Context() ctx: { req: IAuthenticatedRequest },
    @Args('filters', { nullable: true }) filters?: WarehouseFiltersInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput
  ) {
    const paginationParams = pagination ?? { page: 1, take: 10 }

    try {
      return await this.warehousesService.findByUserCompaniesPaginated(
        ctx.req.user.id,
        filters,
        paginationParams
      )
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to fetch your warehouses',
        code: 'MY_WAREHOUSES_FETCH_FAILED',
        error
      })
    }
  }
}
