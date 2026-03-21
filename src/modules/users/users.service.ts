import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Role } from 'generated/prisma/client'
import { PaginationInput } from '@/src/common/dtos'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import {
  CreateUserInput,
  PaginatedUsersResponse,
  UpdatePasswordInput,
  UpdateProfileInput,
  UpdateUserInput,
  UserFiltersInput
} from './dtos'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const users = await this.prismaService.user.findMany()
    return users.map((user) => {
      delete user.password
      return user
    })
  }

  async findAllPaginated(
    pagination: PaginationInput,
    filters?: UserFiltersInput
  ): Promise<PaginatedUsersResponse> {
    const { page, take } = pagination
    const skip = (page - 1) * take

    const where: Record<string, unknown> = {}

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take
      }),
      this.prismaService.user.count({ where })
    ])

    const total_pages = Math.ceil(total / take)

    return {
      users: users.map((user) => {
        delete user.password
        return user
      }),
      info: {
        total,
        page,
        take,
        total_pages
      }
    }
  }

  async updateRole(userId: string, role: Role) {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { role }
    })

    delete user.password

    return user
  }

  async create(input: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user = await this.prismaService.user.create({
      data: { name: input.name, email: input.email, password: hashedPassword }
    })

    delete user.password

    return user
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } })

    if (!user) return throwGraphQLError({ message: 'User not found', code: 'USER_NOT_FOUND' })

    return user
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } })

    if (!user) return throwGraphQLError({ message: 'User not found', code: 'USER_NOT_FOUND' })

    delete user.password

    return user
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { name: input.name, email: input.email }
    })

    delete user.password

    return user
  }

  async updatePassword(userId: string, input: UpdatePasswordInput) {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } })

    if (!user) return throwGraphQLError({ message: 'User not found', code: 'USER_NOT_FOUND' })

    const isPasswordValid = await bcrypt.compare(input.currentPassword, user.password)

    if (!isPasswordValid) {
      return throwGraphQLError({
        message: 'Current password is incorrect',
        code: 'INVALID_PASSWORD'
      })
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 10)

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    delete updatedUser.password

    return updatedUser
  }

  async updateUser(input: UpdateUserInput) {
    const updateData: Record<string, unknown> = {}

    if (input.name) updateData.name = input.name
    if (input.email) updateData.email = input.email
    if (input.role) updateData.role = input.role

    const user = await this.prismaService.user.update({
      where: { id: input.userId },
      data: updateData
    })

    delete user.password

    return user
  }

  async removeUser(id: string) {
    const user = await this.prismaService.user.delete({
      where: { id }
    })

    delete user.password

    return user
  }
}
