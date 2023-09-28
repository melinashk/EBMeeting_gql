/* eslint-disable prettier/prettier */
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDto {
  @Field(() => ID)
  _id?: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  createdBy: string;

  @Field()
  createdAt: Date

}