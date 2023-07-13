import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ItemsModule } from '../modules/items/items.module';
import { UsersModule } from '../modules/users/users.module';
import { AuthGuard } from '../modules/auth/auth.guard';
import { ApiResolver } from './api.resolver';

@Module({
  imports: [ItemsModule, UsersModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // enable authentication globally
    },
    ApiResolver,
  ],
})
export class ApiModule {}
