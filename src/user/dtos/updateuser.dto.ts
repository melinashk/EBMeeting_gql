/* eslint-disable prettier/prettier */
import { Field, ID } from "@nestjs/graphql";
import { IsEmail, IsString } from "class-validator";

export class UpdateUserDto {
  @Field(() => ID)
  _id?: string;
  
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}