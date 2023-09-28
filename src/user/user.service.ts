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
import * as firebaseAdmin from 'firebase-admin'; 
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Notification.name) private notificationModel: Model<Notification>
  ) {
    if (!firebaseAdmin.apps.length) {
      try {
        firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert(
            path.join(__dirname, '..', '..', "firebase-admin-sdk.json")
          ),
        }, "youruniquefirebase")
      } catch(error) {
        throw new Error(error)
      }
    }
  }
  

  async create(input: CreateUserInput): Promise<User> {
    const { name, email, password, notification } = input;

    let deviceToken: string | undefined;

    if (notification === 'ACCEPTED') {
      deviceToken = uuidv4();
    } else if (notification === 'REJECTED') {
      console.log('You will not be sent any notifications about this app');
    }

    const user = new this.userModel({
      name,
      email,
      password,
      notification,
      deviceToken,
    });

    return user.save();
  }

  async update(id: string, input: UpdateUserInput): Promise<UpdateUserDto> {
    const existingUser = await this.userModel.findById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    existingUser.name = input.name;
    existingUser.email = input.email;
    existingUser.password = input.password;

    const updatedUser = await existingUser.save();

    // Create and save a notification
    const notification = new this.notificationModel({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
      updatedBy: id,
      createdAt: new Date(),
    });
    await notification.save();

    if (existingUser.notification === 'ACCEPTED' && existingUser.device_token) {
      // Send the notification using FCM
      const notification = await this.notificationModel.findOne({
        updatedBy: id,
      });

      if (notification) {
        for (const device_token of existingUser.device_token) {
          const message: firebaseAdmin.messaging.Message = {
            notification: {
              title: notification.title,
              body: notification.description,
            },
            token: device_token,
          };

        try {
          await firebaseAdmin.messaging().send(message);
        } catch (error) {
          console.error('Error sending FCM notification:', error);
          throw new Error('Failed to send FCM notification');
        }
      }
    }
    
    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password,
    };
  }
}}