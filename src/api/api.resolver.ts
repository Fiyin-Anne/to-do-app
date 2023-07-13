import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Item } from '../modules/items/items.model';
import { ItemsService } from '../modules/items/items.service';
import { User } from '../modules/users/users.model';
import { UsersService } from '../modules/users/users.service';
import { AuthGuard } from '../modules/auth/auth.guard';
import { User as CurrentUser } from '../modules/users/user.decorator';
import { Paginated } from '../utils/pagination/pagination.model';

@Resolver()
export class ApiResolver {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly usersService: UsersService,
  ) {}

  // USER RESOLVERS
  @Mutation(() => User)
  async createUser(
    @Args({ name: `username`, type: () => String }) username: User[`username`],
    @Args({ name: `password`, type: () => String }) password: User[`password`],
    @Args({ name: `email`, type: () => String }) email: User[`email`],
  ) {
    return this.usersService.create({ username, password, email });
  }

  @Mutation(() => User)
  async userLogin(
    @Args({ name: `password`, type: () => String }) password: User[`password`],
    @Args({ name: `email`, type: () => String }) email: User[`email`],
  ) {
    return this.usersService.login({ password, email });
  }

  /// TO-DO ITEM RESOLVERS ///

  //get all to-do items
  @Query(() => Paginated)
  @UseGuards(AuthGuard)
  async getAll(
    @CurrentUser() user: User,
    @Args({ name: `page`, type: () => Number, nullable: true}) page?: number,
    @Args({ name: `limit`, type: () => Number, nullable: true}) limit?: number,
  ): Promise<Paginated> {
    return this.itemsService.getAll({ userId: user.id, page, limit });
  }

  // get a to-do item by ID
  @Query(() => Item)
  @UseGuards(AuthGuard)
  async getById(
    @CurrentUser() user: User,
    @Args({ name: `id`, type: () => Number }) id: Item[`id`],
  ): Promise<Item> {
    return this.itemsService.getById({ id, userId: user.id });
  }

  // create a to-do item
  @Mutation(() => Item)
  @UseGuards(AuthGuard)
  async createItem(
    @CurrentUser() user: User,
    @Args({ name: `title`, type: () => String }) title: Item[`title`],
    @Args({ name: `description`, nullable: true, type: () => String })
    description?: Item[`description`],
  ) {
    return this.itemsService.create({ title, description, userId: user.id });
  }

  // edit a to-do item
  @Mutation(() => Item)
  @UseGuards(AuthGuard)
  async editItem(
    @CurrentUser() user: User,
    @Args({ name: `id`, type: () => Number }) id: Item[`id`],
    @Args({ name: `title`, nullable: true, type: () => String })
    title?: Item[`title`],
    @Args({ name: `description`, nullable: true, type: () => String })
    description?: Item[`description`],
    @Args({ name: `completed`, nullable: true, type: () => Boolean })
    completed?: Item[`completed`],
  ) {
    return this.itemsService.edit({
      id,
      title,
      description,
      completed,
      userId: user.id,
    });
  }

  // search for a to-do item
  @Query(() => [Item])
  @UseGuards(AuthGuard)
  async searchItem(
    @CurrentUser() user: User,
    @Args({ name: 'completed', nullable: true, type: () => Boolean })
    completed: Item[`completed`],
    @Args({ name: 'description', nullable: true, type: () => String })
    description: Item[`description`],
    @Args({ name: 'title', nullable: true, type: () => String })
    title: Item[`title`],
  ): Promise<Item[]> {
    return this.itemsService.search({
      title,
      description,
      completed,
      userId: user.id,
    });
  }
}
