import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '@/src/lib/prisma/prisma.service'
import { throwGraphQLError } from '@/src/lib/utils/graphql-error.util'
import { CreateUserInput, UpdatePasswordInput, UpdateProfileInput } from './dtos'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
