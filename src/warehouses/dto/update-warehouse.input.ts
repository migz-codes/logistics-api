import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { Warehouse } from '../entities/warehouse.entity'

@InputType()
export class UpdateWarehouseInput extends PartialType(Warehouse) {
  @Field(() => Int)
  id: number
}
