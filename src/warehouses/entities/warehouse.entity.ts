import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Warehouse as PrismaWarehouse } from '../../../generated/prisma/client'

@ObjectType()
export class Warehouse implements PrismaWarehouse {
  @Field(() => Int)
  id: number

  @Field(() => String)
  name: string
}
