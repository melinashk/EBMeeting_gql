/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';
import { Model } from 'mongoose';
import { CreateUserInput } from './input/input.user';
import { UpdateUserDto } from './dtos/updateuser.dto';
import { Notification } from '../notification/notification.model';
import { UpdateUserInput } from './input/input.updateuser';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Notification.name) private notificationModel: Model<Notification>
    ) {}

  //creating a user
  async create(input: CreateUserInput): Promise<User> {
    const { name, email, password, notification } = input;

    let device_token: [] | undefined;

    //if accepted send the user's device token else log a message 
    if (notification === "ACCEPTED") {
      device_token = uuidv4()
    } else if (notification === "REJECTED") {
      console.log("You will not be sent any notification about this app")
    } 

    const user = new this.userModel({
      name,
      email,
      password,
      notification,
      device_token,
    });
    
    //save the user data
    return user.save();
  }
  
  async update(id: string, input: UpdateUserInput): Promise<UpdateUserDto> {
    const existingUser = await this.userModel.findById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Update user data
    existingUser.name = input.name;
    existingUser.email = input.email;
    existingUser.password = input.password;

    // Save the updated user
    const updatedUser = await existingUser.save();

    // Create and save a notification
    const notification = new this.notificationModel({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
      createdBy: id,
      createdAt: new Date(),
    });
    await notification.save();

    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password,
    };
  }
}
