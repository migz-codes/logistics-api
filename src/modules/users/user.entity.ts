import { Field, ObjectType } from '@nestjs/graphql'
import { User as PrismaUser } from 'generated/prisma/client'

@ObjectType()
export class User implements PrismaUser {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  email: string

  @Field(() => String)
  password: string

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  updated_at: Date
}
