import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CreateUserInput } from './dtos/create-user'
import { User } from './user.entity'
import { UserService } from './users.service'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return await this.userService.create(input)
  }
}
