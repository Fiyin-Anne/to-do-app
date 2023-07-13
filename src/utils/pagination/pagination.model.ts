import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Item } from '../../modules/items/items.model';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { ItemsRepository } from '../../modules/items/items.repository';

@Module({ imports: [PrismaModule], providers: [ItemsRepository] })
@ObjectType()
export class Paginated {
  @Field(() => Int)
  totalcount: number;

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  page: number;

  @Field(() => [Item])
  items: Item[];
}
