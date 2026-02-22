import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import { CreateWarehouseInput } from './dto/create-warehouse.input'
import { UpdateWarehouseInput } from './dto/update-warehouse.input'
import { Warehouse } from './entities/warehouse.entity'
import { WarehousesService } from './warehouses.service'

@Resolver(() => Warehouse)
export class WarehousesResolver {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Mutation(() => Warehouse, { nullable: true })
  async createWarehouse(@Args('input') input: CreateWarehouseInput) {
    try {
      return await this.warehousesService.create(input)
    } catch (error) {
      throw new GraphQLError('Failed to create warehouse', {
        extensions: {
          code: 'WAREHOUSE_CREATE_FAILED',
          originalError: error.message,
          timestamp: new Date().toISOString()
        }
      })
    }
  }

  @Query(() => [Warehouse], { name: 'warehouses', nullable: true })
  async findAll() {
    try {
      return await this.warehousesService.findAll()
    } catch (error) {
      throw new GraphQLError('Failed to fetch warehouses', {
        extensions: {
          code: 'WAREHOUSES_FETCH_FAILED',
          originalError: error.message,
          timestamp: new Date().toISOString()
        }
      })
    }
  }

  @Query(() => Warehouse, { name: 'warehouse', nullable: true })
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.warehousesService.findOne(id)
    } catch (error) {
      throw new GraphQLError('Failed to fetch warehouse', {
        extensions: {
          code: 'WAREHOUSE_FETCH_FAILED',
          originalError: error.message,
          warehouseId: id,
          timestamp: new Date().toISOString()
        }
      })
    }
  }

  @Mutation(() => Warehouse, { nullable: true })
  async updateWarehouse(@Args('input') input: UpdateWarehouseInput) {
    try {
      return await this.warehousesService.update(input)
    } catch (error) {
      throw new GraphQLError('Failed to update warehouse', {
        extensions: {
          code: 'WAREHOUSE_UPDATE_FAILED',
          originalError: error.message,
          warehouseId: input.id,
          timestamp: new Date().toISOString()
        }
      })
    }
  }

  @Mutation(() => Warehouse, { nullable: true })
  async removeWarehouse(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.warehousesService.remove(id)
    } catch (error) {
      throw new GraphQLError('Failed to remove warehouse', {
        extensions: {
          code: 'WAREHOUSE_DELETE_FAILED',
          originalError: error.message,
          warehouseId: id,
          timestamp: new Date().toISOString()
        }
      })
    }
  }
}
