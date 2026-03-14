import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { WarehouseStatus } from 'generated/prisma/client'

@InputType()
export class WarehouseFiltersInput {
  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => String, { nullable: true })
  region?: string

  @Field(() => WarehouseStatus, { nullable: true })
  status?: WarehouseStatus

  @Field(() => Int, { nullable: true })
  skip?: number

  @Field(() => Int, { nullable: true })
  take?: number
}

@InputType()
export class CreateWarehouseInput {
  @Field(() => String)
  title: string

  @Field(() => String)
  description: string

  @Field(() => String)
  city: string

  @Field(() => String)
  state: string

  @Field(() => String)
  price: string

  @Field(() => Float)
  area_total: number

  @Field(() => [String], { nullable: true, defaultValue: [] })
  images: string[]

  @Field(() => WarehouseStatus, { nullable: true, defaultValue: WarehouseStatus.AVAILABLE })
  status: WarehouseStatus

  @Field(() => String)
  address: string

  @Field(() => String)
  zip_code: string

  @Field(() => String)
  country: string

  @Field(() => String, { nullable: true })
  address_complement?: string

  @Field(() => String, { nullable: true, defaultValue: '' })
  accountable_id: string

  @Field(() => String)
  company_id: string
}

@InputType()
export class UpdateWarehouseInput {
  @Field(() => String)
  id: string

  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  city?: string

  @Field(() => String, { nullable: true })
  state?: string

  @Field(() => String, { nullable: true })
  price?: string

  @Field(() => Float, { nullable: true })
  area_total?: number

  @Field(() => [String], { nullable: true })
  images?: string[]

  @Field(() => WarehouseStatus, { nullable: true })
  status?: WarehouseStatus

  @Field(() => String, { nullable: true })
  address?: string

  @Field(() => String, { nullable: true })
  zip_code?: string

  @Field(() => String, { nullable: true })
  country?: string

  @Field(() => String, { nullable: true })
  address_complement?: string
}
