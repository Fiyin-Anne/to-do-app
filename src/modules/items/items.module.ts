import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { ItemsRepository } from './items.repository';
import { UsersRepository } from '../users/users.repository';
import { ItemsService } from './items.service';
import { Validator } from '../../utils/validation/validator';

@Module({
  imports: [PrismaModule],
  providers: [ItemsRepository, ItemsService, UsersRepository, Validator],
  exports: [ItemsService],
})
export class ItemsModule {}
