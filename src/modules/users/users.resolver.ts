import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateUserInput, UpdatePasswordInput, UpdateProfileInput } from './dtos'
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

  @Mutation(() => User)
  async updateProfile(@Args('userId') userId: string, @Args('input') input: UpdateProfileInput) {
    return await this.userService.updateProfile(userId, input)
  }

  @Mutation(() => User)
  async updatePassword(@Args('userId') userId: string, @Args('input') input: UpdatePasswordInput) {
    return await this.userService.updatePassword(userId, input)
  }
}
