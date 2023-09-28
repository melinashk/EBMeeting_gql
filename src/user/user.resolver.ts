/* eslint-disable prettier/prettier */
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './input/input.user';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/updateuser.dto';
import { UpdateUserInput } from './input/input.updateuser';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  //for creating user
  @Mutation(() => UserDto)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserDto> {
    return this.userService.create(input);
  }

  //for updating user
  @Mutation(() => UserDto)
  async updateUser(
  @Args('id') id: string,
  @Args('input') input: UpdateUserInput,
): Promise<UpdateUserDto> {
  return this.userService.update(id, input);
}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
