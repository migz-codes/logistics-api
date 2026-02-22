import { Field, InputType, OmitType } from '@nestjs/graphql'
import { Warehouse } from '../entities/warehouse.entity'

@InputType()
export class CreateWarehouseInput extends OmitType(Warehouse, ['id']) {
  @Field(() => String)
  name: string
}
