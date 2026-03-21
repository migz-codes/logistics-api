import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Role } from 'generated/prisma/client'
import { PaginationInput } from '@/src/common/dtos'
import { AuthGuard } from '../auth/auth.guard'
import { IAuthenticatedRequest } from '../auth/dtos'
import { Roles } from '../roles/roles.decorator'
import { RolesGuard } from '../roles/roles.guard'
import {
  CreateUserInput,
  PaginatedUsersResponse,
  UpdatePasswordInput,
  UpdateProfileInput,
  UpdateUserInput,
  UpdateUserRoleInput,
  UserFiltersInput
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

  @Query(() => PaginatedUsersResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUsers(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Args('filters', { nullable: true }) filters?: UserFiltersInput
  ) {
    const paginationParams = pagination ?? { page: 1, take: 10 }
    return await this.userService.findAllPaginated(paginationParams, filters)
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @Mutation(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateUser(@Args('input') input: UpdateUserInput) {
    return await this.userService.updateUser(input)
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async removeUser(@Args('id', { type: () => String }) id: string) {
    return await this.userService.removeUser(id)
  }
}
