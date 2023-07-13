import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemsRepository } from './items.repository';
import { UsersRepository } from '../users/users.repository';
import { Item } from '@prisma/client';

import { Validator } from '../../utils/validation/validator';
import {
  EditItemSchema,
  GetByIdSchema,
  GetItemsSchema,
  ItemSchema,
  SearchItemSchema,
} from '../../utils/validation/item.schema';
import { paginate } from '../../utils/pagination/pagination.util';
import { Paginated } from '../../utils/pagination/pagination.model';

@Injectable()
export class ItemsService {
  constructor(
    private usersrepo: UsersRepository,
    private validator: Validator,
    private repository: ItemsRepository,
  ) {}

  // create a new to-do item
  async create(params: {
    title: Item[`title`];
    description?: Item[`description`];
    userId: Item[`userId`];
  }) {
    try {
      // validate payload
      params = this.validator.validate(ItemSchema, params);

      const { title, description, userId } = params;
      // check if user exists
      const user = await this.usersrepo.getUser({
        where: {
          id: userId,
        },
      });

      if (!user) throw new NotFoundException('User not found.');

      return this.repository.create({
        data: {
          title,
          description,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      const message = error.meta?.cause || error.message;
      throw new Error(message);
    }
  }

  // edit by ID
  async edit(params: {
    title?: Item[`title`];
    description?: Item[`description`];
    completed?: Item[`completed`];
    id: Item[`id`];
    userId: Item[`userId`];
  }): Promise<Item> {
    try {
      // validate payload
      params = this.validator.validate(EditItemSchema, params);
      // check that user has an item with that ID
      const { title, description, completed, id, userId } = params;

      const editedItem = await this.repository.editItem({
        data: {
          title,
          description,
          completed,
          updatedAt: new Date(),
        },
        where: {
          id,
          userId,
        },
      });

      if (!editedItem) throw new NotFoundException('Item not found.');

      return editedItem;
    } catch (error) {
      const message = error.meta?.cause || error.message;
      throw new Error(message);
    }
  }

  // get all to-do items
  // TO-DO: try transactions
  async getAll(params: { 
    userId: Item[`userId`];
    page?: number;
    limit?: number;
  }): Promise<Paginated> {

    // validate payload
    try {
      params = this.validator.validate(GetItemsSchema, params);

      const { userId, page, limit } = params;

      const { skip, take } = paginate({ page, limit });

      // let allItems: Item[];

      // fetch total
      const totalcount = await this.repository.count({ 
        where: {
          userId
        }
      });

      const allItems = await this.repository.getAll({
        where: {
          userId,
        },
        skip,
        take
      });

      return {
        page,
        totalcount,
        count: allItems.length,
        items: allItems
      };

    } catch (error) {
      const message = error.meta?.cause || error.message;
      throw new Error(message);
    }
  }

  // get a to-do item by their ID
  async getById(params: {
    id: Item[`id`];
    userId: Item[`userId`];
  }): Promise<Item> {
    try {
      // validate payload
      params = this.validator.validate(GetByIdSchema, params);

      const items = await this.repository.getAll({
        where: {
          id: params.id,
          userId: params.userId,
        },
      });

      if (!items.length) throw new NotFoundException('Item not found.');

      return items[0];
    } catch (error) {
      const message = error.meta?.cause || error.message;
      throw new Error(message);
    }
  }

  // get to-do items by title, description, or completion status
  async search(params: {
    completed?: Item[`completed`];
    description?: Item[`description`];
    title?: Item[`title`];
    id?: Item[`id`];
    userId: Item[`userId`];
  }): Promise<Item[]> {
    try {
      // validate payload
      params = this.validator.validate(SearchItemSchema, params);

      const allItems = await this.repository.getAll({
        where: {
          userId: params.userId,
          OR: [
            {
              completed: {
                equals: params.completed,
              },
            },
            {
              id: {
                equals: params.id,
              },
            },
            {
              title: {
                contains: params.title,
              },
            },
            {
              description: {
                contains: params.description,
              },
            },
          ],
        },
      });

      if (!allItems.length) throw new NotFoundException('Items not found.');

      return allItems;
    } catch (error) {
      const message = error.meta?.cause || error.message;
      throw new Error(message);
    }
  }
}
