import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateWarehouseInput } from './dto/create-warehouse.input'
import { UpdateWarehouseInput } from './dto/update-warehouse.input'

@Injectable()
export class WarehousesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateWarehouseInput) {
    const warehouse = await this.prismaService.warehouse.create({
      data: { name: input.name }
    })

    return warehouse
  }

  async findAll() {
    const warehouses = await this.prismaService.warehouse.findMany()

    return warehouses
  }

  async findOne(id: number) {
    const warehouse = await this.prismaService.warehouse.findUnique({
      where: { id }
    })

    return warehouse
  }

  async update(input: UpdateWarehouseInput) {
    const warehouse = await this.prismaService.warehouse.update({
      where: { id: input.id },
      data: { name: input.name }
    })

    return warehouse
  }

  async remove(id: number) {
    const warehouse = await this.prismaService.warehouse.delete({
      where: { id }
    })

    return warehouse
  }
}
