import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Role } from 'generated/prisma/client'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import {
  CreateUserInput,
  UpdatePasswordInput,
  UpdateProfileInput,
  UpdateUserRoleInput
} from './dtos'
import { User } from './user.entity'
import { UserService } from './users.service'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return await this.userService.create(input)
  }

  @Query(() => User)
  async getUserById(@Args('id') id: string) {
    return await this.userService.findById(id)
  }

  @Query(() => [User])
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  async getAllUsers() {
    return await this.userService.findAll()
  }

  @Mutation(() => User)
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  async updateUserRole(@Args('input') input: UpdateUserRoleInput) {
    return await this.userService.updateRole(input.userId, input.role)
  }

  @Mutation(() => User)
  async updateProfile(@Args('userId') userId: string, @Args('input') input: UpdateProfileInput) {
    return await this.userService.updateProfile(userId, input)
  }

  @Mutation(() => User)
  async updatePassword(@Args('userId') userId: string, @Args('input') input: UpdatePasswordInput) {
    return await this.userService.updatePassword(userId, input)
  }
}
