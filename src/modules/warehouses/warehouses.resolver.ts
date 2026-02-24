import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { CreateWarehouseInput } from './dtos/dtos'
import { UpdateWarehouseInput } from './dtos/update-warehouse.input'
import { Warehouse } from './warehouse.entity'
import { WarehousesService } from './warehouses.service'

@Resolver(() => Warehouse)
export class WarehousesResolver {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Mutation(() => Warehouse, { nullable: true })
  async createWarehouse(@Args('input') input: CreateWarehouseInput) {
    try {
      return await this.warehousesService.create(input)
    } catch (error) {
      throwGraphQLError('Failed to create warehouse', 'WAREHOUSE_CREATE_FAILED', error)
    }
  }

  @Query(() => [Warehouse], { name: 'warehouses', nullable: true })
  async findAll() {
    try {
      return await this.warehousesService.findAll()
    } catch (error) {
      throwGraphQLError('Failed to fetch warehouses', 'WAREHOUSES_FETCH_FAILED', error)
    }
  }

  @Query(() => Warehouse, { name: 'warehouse', nullable: true })
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.warehousesService.findOne(id)
    } catch (error) {
      throwGraphQLError('Failed to fetch warehouse', 'WAREHOUSE_FETCH_FAILED', error, {
        warehouseId: id
      })
    }
  }

  @Mutation(() => Warehouse, { nullable: true })
  async updateWarehouse(@Args('input') input: UpdateWarehouseInput) {
    try {
      return await this.warehousesService.update(input)
    } catch (error) {
      throwGraphQLError('Failed to update warehouse', 'WAREHOUSE_UPDATE_FAILED', error, {
        warehouseId: input.id
      })
    }
  }

  @Mutation(() => Warehouse, { nullable: true })
  async removeWarehouse(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.warehousesService.remove(id)
    } catch (error) {
      throwGraphQLError('Failed to remove warehouse', 'WAREHOUSE_DELETE_FAILED', error, {
        warehouseId: id
      })
    }
  }
}
