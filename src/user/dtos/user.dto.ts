/* eslint-disable prettier/prettier */
import { Field, ID, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class UserDto {
  @Field(() => ID)
  _id?: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => [String], { nullable: true })
  device_token: string[] | null;

}