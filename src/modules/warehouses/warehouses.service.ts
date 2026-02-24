import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { CreateWarehouseInput } from './dtos/dtos'
import { UpdateWarehouseInput } from './dtos/update-warehouse.input'

@Injectable()
export class WarehousesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateWarehouseInput) {
    const warehouse = await this.prismaService.warehouse.create({
      data: {
        city: input.city,
        area: input.area,
        price: input.price,
        title: input.title,
        state: input.state,
        status: input.status,
        country: input.country,
        address: input.address,
        zip_code: input.zip_code,
        category: input.category,
        description: input.description,
        accountable_id: input.accountable_id
      }
    })

    return warehouse
  }

  async findAll() {
    const warehouses = await this.prismaService.warehouse.findMany()

    return warehouses
  }

  async findOne(id: string) {
    const warehouse = await this.prismaService.warehouse.findUnique({
      where: { id }
    })

    return warehouse
  }

  async update(input: UpdateWarehouseInput) {
    const warehouse = await this.prismaService.warehouse.update({
      where: { id: input.id },
      data: { title: input.title }
    })

    return warehouse
  }

  async remove(id: string) {
    const warehouse = await this.prismaService.warehouse.delete({
      where: { id }
    })

    return warehouse
  }
}
