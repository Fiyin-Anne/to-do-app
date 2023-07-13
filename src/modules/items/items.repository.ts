import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma, Item } from '@prisma/client';

@Injectable()
export class ItemsRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.ItemCreateInput }): Promise<Item> {
    const { data } = params;
    return this.prisma.item.create({ data });
  }

  async getAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ItemWhereUniqueInput;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.item.findMany({ skip, take, cursor, where, orderBy });
  }

  async getOne(params: { where?: Prisma.ItemWhereUniqueInput }) {
    return this.prisma.item.findUnique({ where: params.where });
  }

  // edit item by ID
  async editItem(params: {
    data: Prisma.ItemUpdateInput;
    where: Prisma.ItemWhereUniqueInput;
  }): Promise<Item> {
    const { data, where } = params;
    return this.prisma.item.update({
      where,
      data,
    });
  }

  // count items
  async count(params: {
    where?: Prisma.ItemWhereInput;
    skip?: number;
    take?: number;
  }): Promise<number> {
    const { where, take, skip } = params;
    const total = await this.prisma.item.count({
      where,
      take,
      skip,
    });
    return total;
  }
}
