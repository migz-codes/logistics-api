import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql'
import { Role } from 'generated/prisma/client'
import { PaginationInfo } from '@/src/common/dtos'
import { User } from './user.entity'

@InputType()
export class CreateUserInput extends OmitType(User, ['id', 'created_at', 'updated_at', 'role']) {
  @Field(() => String)
  name: string

  @Field(() => String)
  email: string

  @Field(() => String)
  password: string
}

@InputType()
export class UpdateUserRoleInput {
  @Field(() => String)
  userId: string

  @Field(() => Role)
  role: Role
}

@InputType()
export class UpdateProfileInput {
  @Field(() => String)
  name: string

  @Field(() => String)
  email: string
}

@InputType()
export class UpdatePasswordInput {
  @Field(() => String)
  currentPassword: string

  @Field(() => String)
  newPassword: string
}

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  userId: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => Role, { nullable: true })
  role?: Role
}

@InputType()
export class UserFiltersInput {
  @Field(() => String, { nullable: true })
  search?: string
}

@ObjectType()
export class PaginatedUsersResponse {
  @Field(() => [User])
  users: User[]

  @Field(() => PaginationInfo)
  info: PaginationInfo
}
