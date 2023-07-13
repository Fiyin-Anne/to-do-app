import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { Item as ItemDB } from '@prisma/client';
import { PrismaModule } from '../../database/prisma.module';
import { ItemsRepository } from './items.repository';

@Module({ imports: [PrismaModule], providers: [ItemsRepository] })
@ObjectType()
export class Item {
  @Field(() => Int)
  id: ItemDB[`id`];

  @Field(() => String)
  title: ItemDB[`title`];

  @Field(() => String, { nullable: true })
  description?: ItemDB[`description`];

  @Field(() => Boolean)
  completed: ItemDB[`completed`];

  @Field(() => Int)
  userId: ItemDB[`userId`];

  @Field(() => GraphQLISODateTime)
  createdAt: ItemDB[`createdAt`];

  @Field(() => GraphQLISODateTime)
  updatedAt: ItemDB[`updatedAt`];
}
