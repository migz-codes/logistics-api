import { Request, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { AuthGuard } from '../auth/auth.guard'
import { IAuthenticatedRequest } from '../auth/dtos'
import { CreateWarehouseInput, UpdateWarehouseInput } from './dtos'
import { Warehouse } from './warehouse.entity'
import { WarehousesService } from './warehouses.service'

@Resolver(() => Warehouse)
export class WarehousesResolver {
  constructor(private readonly warehousesService: WarehousesService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Warehouse, { nullable: true })
  async createWarehouse(
    @Args('input') input: CreateWarehouseInput,
    @Request() req: IAuthenticatedRequest
  ) {
    const userId = req.user.id

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

  @UseGuards(AuthGuard)
  @Query(() => [Warehouse], { name: 'warehouses', nullable: true })
  async findAll() {
    try {
      return await this.warehousesService.findAll()
    } catch (error) {
      throwGraphQLError({
        message: 'Failed to fetch warehouses',
        code: 'WAREHOUSES_FETCH_FAILED',
        error
      })
    }
  }

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
}
