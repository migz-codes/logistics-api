import { Field, ObjectType } from '@nestjs/graphql'
import { Warehouse as PrismaWarehouse } from '../../../generated/prisma/client'

@ObjectType()
export class Warehouse implements PrismaWarehouse {
  @Field(() => String)
  id: string

  @Field(() => String)
  accountable_id: string

  @Field(() => String)
  title: string

  @Field(() => String)
  description: string

  @Field(() => String)
  city: string

  @Field(() => String)
  state: string

  @Field(() => String)
  category: string

  @Field(() => String)
  area: string

  @Field(() => String)
  status: string

  @Field(() => String)
  price: string

  @Field(() => String)
  address: string

  @Field(() => String)
  zip_code: string

  @Field(() => String)
  country: string

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  updated_at: Date
}
