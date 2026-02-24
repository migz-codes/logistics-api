import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql'
import { Warehouse } from './warehouse.entity'

@InputType()
export class CreateWarehouseInput extends OmitType(Warehouse, ['id', 'created_at', 'updated_at']) {
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

  @Field(() => String)
  accountable_id: string
}

@InputType()
export class UpdateWarehouseInput extends PartialType(Warehouse) {
  @Field(() => String)
  id: string
}
