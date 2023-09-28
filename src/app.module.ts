import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://melinashakya20:melina20@cluster0.sbnak9d.mongodb.net/notification?retryWrites=true&w=majority',
    ),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
    }),
    UserModule,
    NotificationModule,
  ],
})
export class AppModule {}
