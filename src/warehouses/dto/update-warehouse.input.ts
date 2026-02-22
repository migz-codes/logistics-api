import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Warehouse } from '../entities/warehouse.entity'

@InputType()
export class UpdateWarehouseInput extends PartialType(Warehouse) {
  @Field(() => String)
  id: string
}
