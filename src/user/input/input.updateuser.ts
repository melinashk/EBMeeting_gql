/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
