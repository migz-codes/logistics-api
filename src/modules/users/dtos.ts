import { Field, InputType, OmitType } from '@nestjs/graphql'
import { Role } from 'generated/prisma/client'
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
