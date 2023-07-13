import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '2 days' },
    }),
    PrismaModule,
  ],
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
