/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { Notification, NotificationSchema } from '../notification/notification.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}
