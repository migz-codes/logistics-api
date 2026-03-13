import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { CreateWarehouseInput, UpdateWarehouseInput, WarehouseFiltersInput } from './dtos'

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
        accountable_id: input.accountable_id,
        company_id: input.company_id
      }
    })

    return warehouse
  }

  async findAll(filters?: WarehouseFiltersInput) {
    const where: Record<string, unknown> = {}

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters?.region) {
      where.state = filters.region
    }

    if (filters?.category) {
      where.category = filters.category
    }

    if (filters?.status) {
      where.status = filters.status
    }

    const warehouses = await this.prismaService.warehouse.findMany({
      where,
      skip: filters?.skip,
      take: filters?.take,
      orderBy: { created_at: 'desc' }
    })

    return warehouses
  }

  async count(filters?: WarehouseFiltersInput) {
    const where: Record<string, unknown> = {}

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters?.region) {
      where.state = filters.region
    }

    if (filters?.category) {
      where.category = filters.category
    }

    if (filters?.status) {
      where.status = filters.status
    }

    return this.prismaService.warehouse.count({ where })
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
