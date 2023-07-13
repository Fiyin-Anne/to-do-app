import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { User as UserDB } from '@prisma/client';
import { PrismaModule } from '../../database/prisma.module';
import { UsersRepository } from './users.repository';

@Module({ imports: [PrismaModule], providers: [UsersRepository] })
@ObjectType()
export class User {
  @Field(() => Int)
  id: UserDB[`id`];

  @Field(() => String)
  username: UserDB[`username`];

  @Field(() => String)
  email: UserDB[`email`];

  @Field(() => String)
  password: UserDB[`password`];

  @Field(() => String)
  token: string;

  @Field(() => GraphQLISODateTime)
  createdAt: UserDB[`createdAt`];

  @Field(() => GraphQLISODateTime)
  updatedAt: UserDB[`updatedAt`];
}
