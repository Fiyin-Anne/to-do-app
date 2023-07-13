import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Validator } from '../../utils/validation/validator';

@Module({
  imports: [PrismaModule],
  providers: [
    UsersRepository,
    UsersService,
    AuthService,
    JwtService,
    Validator,
  ],
  exports: [UsersService],
})
export class UsersModule {}
