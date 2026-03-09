import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Role } from 'generated/prisma/client'
import { AuthGuard } from '../auth/auth.guard'
import { IAuthenticatedRequest } from '../auth/dtos'
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
  @UseGuards(AuthGuard)
  async updateProfile(
    @Context('req') req: IAuthenticatedRequest,
    @Args('input') input: UpdateProfileInput
  ) {
    return await this.userService.updateProfile(req.user.id, input)
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updatePassword(
    @Context('req') req: IAuthenticatedRequest,
    @Args('input') input: UpdatePasswordInput
  ) {
    return await this.userService.updatePassword(req.user.id, input)
  }
}
